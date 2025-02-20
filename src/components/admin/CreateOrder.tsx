
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CustomerDisplay } from "./order/CustomerDisplay";
import { ProductsList } from "./order/ProductsList";
import { OrderSummary } from "./order/OrderSummary";

interface CreateOrderProps {
  onCancel: () => void;
}

const TEST_CUSTOMER = {
  id: "e59a4eb5-3dd5-4f8f-96e5-75f16564bcf3",
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

  const handleCreateOrder = async () => {
    try {
      if (selectedProducts.length === 0) {
        toast.error("Adicione pelo menos um produto");
        return;
      }

      // Verificar se todos os produtos têm código Omie
      const productsWithoutOmieCode = selectedProducts.filter(
        product => !product.omie_code
      );

      if (productsWithoutOmieCode.length > 0) {
        toast.error("Alguns produtos não estão sincronizados com o Omie");
        return;
      }

      setLoading(true);

      const orderItems = selectedProducts.map(product => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        omie_code: product.omie_code || null, // Garante que sempre teremos um valor, mesmo que null
        omie_product_id: product.omie_product_id || null // Inclui o ID do produto no Omie
      }));

      const total = calculateTotal();

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

      const { data: prefData, error: prefError } = await supabase.functions.invoke(
        'mercadopago-checkout',
        {
          body: {
            order_id: order.id,
            items: orderItems,
            payer: {
              name: selectedCustomer.full_name,
              email: "test_user_123@testuser.com",
              identification: {
                type: "CPF",
                number: selectedCustomer.cpf
              }
            }
          }
        }
      );

      if (prefError) throw prefError;

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
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && selectedProducts.length === 0) {
      const activeProduct = products.find(p => p.active && p.omie_code);
      if (activeProduct) {
        setSelectedProducts([{
          ...activeProduct,
          quantity: 1
        }]);
      }
    }
  }, [products]);

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <CustomerDisplay customer={selectedCustomer} />
            <div className="space-y-4">
              <label className="text-sm font-medium">Produtos</label>
              <ProductsList
                products={products}
                selectedProducts={selectedProducts}
                isLoading={isLoadingProducts}
                onProductQuantityChange={handleProductQuantityChange}
              />
            </div>
          </CardContent>
        </Card>

        <OrderSummary
          total={calculateTotal()}
          loading={loading}
          onCreateOrder={handleCreateOrder}
          onCancel={onCancel}
          hasProducts={selectedProducts.length > 0}
        />
      </div>
    </div>
  );
};

export default CreateOrder;
