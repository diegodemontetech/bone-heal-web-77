
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CreateOrderProps {
  onCancel: () => void;
}

const TEST_CUSTOMER = {
  id: "e59a4eb5-3dd5-4f8f-96e5-75f16564bcf3", // Usando o ID do seu usuário admin
  full_name: "Cliente Teste",
  omie_code: "12345678",
  cpf: "12345678900",
  address: "Rua Teste, 123",
  city: "São Paulo",
  state: "SP",
  zip_code: "01234567",
  phone: "11999999999"
};

const CreateOrder = ({ onCancel }: CreateOrderProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(TEST_CUSTOMER);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Buscar produtos
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq('active', true)
        .order("name");

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      
      return data || [];
    },
  });

  // Calcular total
  const calculateTotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // Criar pedido e redirecionar para pagamento
  const handleCreateOrder = async () => {
    try {
      if (selectedProducts.length === 0) {
        toast.error("Adicione pelo menos um produto");
        return;
      }

      setLoading(true);

      // Preparar itens do pedido
      const orderItems = selectedProducts.map(product => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        omie_code: product.omie_code
      }));

      const total = calculateTotal();

      // Criar pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: selectedCustomer.id,
          items: orderItems,
          total_amount: total,
          subtotal: total,
          status: "pending",
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

      if (orderError) throw orderError;

      // Criar preferência de pagamento no Mercado Pago
      const { data: prefData, error: prefError } = await supabase.functions.invoke(
        'mercadopago-checkout',
        {
          body: {
            order_id: order.id,
            items: orderItems,
            payer: {
              name: selectedCustomer.full_name,
              email: "test_user_123@testuser.com", // Email de teste
              identification: {
                type: "CPF",
                number: selectedCustomer.cpf
              }
            }
          }
        }
      );

      if (prefError) throw prefError;

      // Atualizar pedido com ID da preferência
      await supabase
        .from("orders")
        .update({
          mp_preference_id: prefData.preferenceId
        })
        .eq("id", order.id);

      toast.success("Pedido criado com sucesso!");
      
      // Redirecionar para página do pedido com link de pagamento
      navigate(`/orders/${order.id}`, { 
        state: { 
          showPaymentButton: true,
          paymentMethod: "credit_card",
          orderTotal: total
        }
      });
      
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  // Auto-selecionar primeiro produto ao carregar
  useEffect(() => {
    if (products.length > 0 && selectedProducts.length === 0) {
      setSelectedProducts([{
        ...products[0],
        quantity: 1
      }]);
    }
  }, [products]);

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <div className="p-3 border rounded bg-gray-50">
                <p className="font-medium">{TEST_CUSTOMER.full_name}</p>
                <p className="text-sm text-gray-600">{TEST_CUSTOMER.phone}</p>
                <p className="text-sm text-gray-600">{TEST_CUSTOMER.address}</p>
                <p className="text-sm text-gray-600">
                  {TEST_CUSTOMER.city} - {TEST_CUSTOMER.state}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Produtos</label>
              {isLoadingProducts ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        className="w-20"
                        value={
                          selectedProducts.find((p) => p.id === product.id)
                            ?.quantity || 0
                        }
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value);
                          if (quantity > 0) {
                            setSelectedProducts((prev) => {
                              const existing = prev.find(
                                (p) => p.id === product.id
                              );
                              if (existing) {
                                return prev.map((p) =>
                                  p.id === product.id
                                    ? { ...p, quantity }
                                    : p
                                );
                              }
                              return [
                                ...prev,
                                {
                                  ...product,
                                  quantity,
                                },
                              ];
                            });
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((p) => p.id !== product.id)
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    R$ {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={handleCreateOrder}
                  disabled={loading || selectedProducts.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Criando Pedido...
                    </>
                  ) : (
                    'Criar Pedido'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
