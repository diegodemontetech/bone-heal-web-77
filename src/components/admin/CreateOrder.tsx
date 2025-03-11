
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
import { Search, UserPlus } from "lucide-react";
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
      let query = supabase
        .from("products")
        .select("*")
        .eq('active', true);
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      query = query.order("name");

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
      
      return data || [];
    },
  });

  // Buscar clientes
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
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
        return [];
      }
      
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

    const invalidProducts = selectedProducts.filter(
      product => !product.omie_code
    );

    if (invalidProducts.length > 0) {
      throw new Error(`Os seguintes produtos não estão sincronizados com o Omie: ${invalidProducts.map(p => p.name).join(", ")}`);
    }

    if (!selectedCustomer.address || !selectedCustomer.city || 
        !selectedCustomer.state || !selectedCustomer.zip_code) {
      throw new Error("Dados de endereço do cliente incompletos");
    }

    // Validar dados específicos do Omie
    const requiredFields = [
      'cidade_ibge',
      'estado_ibge',
      'pessoa_fisica',
      'contribuinte',
      'tipo_atividade'
    ];

    const missingFields = requiredFields.filter(field => !selectedCustomer[field]);
    if (missingFields.length > 0) {
      throw new Error(`Dados do cliente incompletos para integração com Omie. Campos faltantes: ${missingFields.join(", ")}`);
    }

    console.log("Validação concluída com sucesso");
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
        omie_code: product.omie_code,
        omie_product_id: product.omie_product_id
      }));

      const total = calculateTotal();

      console.log("Criando pedido na base de dados...");
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: selectedCustomer.id,
          items: orderItems,
          total_amount: total,
          subtotal: total,
          status: 'aguardando_pagamento',
          omie_status: "novo",
          shipping_address: {
            address: selectedCustomer.address,
            city: selectedCustomer.city,
            state: selectedCustomer.state,
            zip_code: selectedCustomer.zip_code
          }
        })
        .select()
        .single();

      if (orderError) {
        console.error("Erro ao criar pedido:", orderError);
        throw orderError;
      }

      console.log("Pedido criado com sucesso, criando preferência no MercadoPago...");
      const { data: prefData, error: prefError } = await supabase.functions.invoke(
        'mercadopago-checkout',
        {
          body: {
            order_id: order.id,
            items: orderItems,
            payer: {
              name: selectedCustomer.full_name,
              email: selectedCustomer.email || "test_user_123@testuser.com",
              identification: {
                type: "CPF",
                number: selectedCustomer.cpf
              }
            }
          }
        }
      );

      if (prefError) {
        console.error("Erro ao criar preferência MP:", prefError);
        throw prefError;
      }

      console.log("Preferência MP criada, atualizando pedido...");
      await supabase
        .from("orders")
        .update({
          mp_preference_id: prefData.preferenceId
        })
        .eq("id", order.id);

      toast.success("Pedido criado com sucesso!");
      
      navigate(`/orders/${order.id}`, { 
        state: { 
          showPaymentButton: true,
          paymentMethod: "credit_card",
          orderTotal: total
        }
      });
      
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
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : customers.length > 0 ? (
                    customers.map(customer => (
                      <div
                        key={customer.id}
                        className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <p className="font-medium">{customer.full_name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
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
