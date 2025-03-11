
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CustomerDisplay } from "./order/CustomerDisplay";
import { ProductsList } from "./order/ProductsList";
import { OrderSummary } from "./order/OrderSummary";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RegistrationForm from "@/components/auth/RegistrationForm";

interface CreateOrderProps {
  onCancel: () => void;
}

const CreateOrder = ({ onCancel }: CreateOrderProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Buscar produtos com filtro de pesquisa
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: async () => {
      console.log("Buscando produtos com filtro:", searchTerm);
      let query = supabase
        .from("products")
        .select("*");
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      query = query.order("name");

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao buscar produtos");
        return [];
      }
      
      console.log(`Encontrados ${data?.length || 0} produtos`);
      return data || [];
    },
  });

  // Buscar clientes
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("Buscando clientes com filtro:", customerSearchTerm);
      let query = supabase
        .from("profiles")
        .select("*");
      
      if (customerSearchTerm) {
        query = query.or(`full_name.ilike.%${customerSearchTerm}%,email.ilike.%${customerSearchTerm}%`);
      }
      
      query = query.order("full_name");

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao buscar clientes");
        return [];
      }
      
      console.log(`Encontrados ${data?.length || 0} clientes`);
      return data || [];
    },
  });

  const calculateTotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleProductQuantityChange = (product: any, quantity: number) => {
    if (quantity > 0) {
      setSelectedProducts((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, quantity } : p
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } else {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
    }
  };

  const validateOrderData = () => {
    console.log("Validando dados do pedido...");

    if (!selectedCustomer?.id) {
      throw new Error("Cliente não selecionado");
    }

    if (selectedProducts.length === 0) {
      throw new Error("Adicione pelo menos um produto");
    }

    // Verificação mais básica para permitir pedidos mesmo sem códigos Omie
    const invalidProducts = selectedProducts.filter(p => !p.price || p.price <= 0);
    if (invalidProducts.length > 0) {
      throw new Error(`Os seguintes produtos têm preços inválidos: ${invalidProducts.map(p => p.name).join(", ")}`);
    }

    return true;
  };

  const handleCreateOrder = async () => {
    try {
      console.log("Iniciando criação do pedido...");
      setLoading(true);

      try {
        validateOrderData();
      } catch (validationError: any) {
        toast.error(validationError.message);
        return;
      }

      const orderItems = selectedProducts.map(product => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        omie_code: product.omie_code || null,
        omie_product_id: product.omie_product_id || null
      }));

      const total = calculateTotal();

      // Valores padrão para endereço, caso não exista
      const shippingAddress = {
        address: selectedCustomer.address || "Endereço não informado",
        city: selectedCustomer.city || "Cidade não informada",
        state: selectedCustomer.state || "UF",
        zip_code: selectedCustomer.zip_code || "00000-000"
      };

      console.log("Criando pedido na base de dados...");
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: selectedCustomer.id,
          items: orderItems,
          total_amount: total,
          subtotal: total,
          status: 'pending',
          omie_status: "novo",
          shipping_address: shippingAddress
        })
        .select()
        .single();

      if (orderError) {
        console.error("Erro ao criar pedido:", orderError);
        throw orderError;
      }

      console.log("Pedido criado com sucesso, ID:", order.id);
      toast.success("Pedido criado com sucesso!");
      
      // Opcionalmente criar preferência no MercadoPago
      try {
        const { data: prefData, error: prefError } = await supabase.functions.invoke(
          'mercadopago-checkout',
          {
            body: {
              order_id: order.id,
              items: orderItems,
              payer: {
                name: selectedCustomer.full_name || "Cliente",
                email: selectedCustomer.email || "cliente@example.com",
                identification: {
                  type: "CPF",
                  number: selectedCustomer.cpf || "00000000000"
                }
              }
            }
          }
        );

        if (prefError) {
          console.warn("Erro ao criar preferência MP, pedido criado sem opção de pagamento:", prefError);
        } else if (prefData?.preferenceId) {
          await supabase
            .from("orders")
            .update({
              mp_preference_id: prefData.preferenceId
            })
            .eq("id", order.id);
          console.log("Preferência MP criada:", prefData.preferenceId);
        }
      } catch (mpError) {
        console.warn("Erro ao processar pagamento, pedido criado sem opção de pagamento:", mpError);
      }
      
      // Redirecionar para página do pedido
      navigate(`/admin/orders`);
      
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao criar pedido: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  // Quando um novo cliente é registrado com sucesso
  const handleRegistrationSuccess = (newCustomer: any) => {
    setSelectedCustomer(newCustomer);
    setCustomerDialogOpen(false);
    toast.success("Cliente cadastrado com sucesso!");
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Cliente */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cliente</h3>
            
            {!selectedCustomer ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar cliente por nome ou e-mail..."
                    className="pl-8"
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {isLoadingCustomers ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="animate-spin h-6 w-6 text-primary" />
                    </div>
                  ) : customers.length > 0 ? (
                    customers.map(customer => (
                      <div
                        key={customer.id}
                        className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <p className="font-medium">{customer.full_name || "Sem nome"}</p>
                        <p className="text-sm text-muted-foreground">{customer.email || "Sem email"}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum cliente encontrado
                    </div>
                  )}
                </div>
                
                <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Cadastrar Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <RegistrationForm 
                        isDentist={true} 
                        isModal={true} 
                        onSuccess={handleRegistrationSuccess}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <CustomerDisplay customer={selectedCustomer} />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Alterar Cliente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Produtos</h3>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produto por nome..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <ProductsList
                products={products}
                selectedProducts={selectedProducts}
                isLoading={isLoadingProducts}
                onProductQuantityChange={handleProductQuantityChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card className="lg:col-span-1">
          <OrderSummary
            total={calculateTotal()}
            loading={loading}
            onCreateOrder={handleCreateOrder}
            onCancel={onCancel}
            hasProducts={selectedProducts.length > 0}
          />
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
