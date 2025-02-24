
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

// Cliente de teste com todos os campos necessários
const TEST_CUSTOMER = {
  id: "e59a4eb5-3dd5-4f8f-96e5-75f16564bcf3",
  full_name: "Dra. Maria Silva",
  email: "maria.silva@dentista.com.br",
  omie_code: "12345678",
  cpf: "12345678900",
  address: "Avenida Paulista",
  endereco_numero: "1000",
  complemento: "Sala 123",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  zip_code: "01310100",
  phone: "11999999999",
  cidade_ibge: "3550308", // Código IBGE de São Paulo
  estado_ibge: "35", // Código IBGE de SP
  pessoa_fisica: true,
  exterior: false,
  contribuinte: "2",
  optante_simples_nacional: false,
  inativo: false,
  bloqueado: false,
  tipo_atividade: "0"
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
        .eq('omie_code', '7630401')
        .order("name");

      if (error) {
        console.error("Erro ao buscar produtos:", error);
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
      if (!selectedCustomer?.id) {
        toast.error("Cliente não selecionado");
        return;
      }

      if (selectedProducts.length === 0) {
        toast.error("Adicione pelo menos um produto");
        return;
      }

      const invalidProducts = selectedProducts.filter(
        product => !product.omie_code || !product.omie_product_id
      );

      if (invalidProducts.length > 0) {
        const productNames = invalidProducts.map(p => p.name).join(", ");
        toast.error(`Os seguintes produtos não estão sincronizados com o Omie: ${productNames}`);
        return;
      }

      setLoading(true);

      const orderItems = selectedProducts.map(product => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        omie_code: product.omie_code,
        omie_product_id: product.omie_product_id
      }));

      const total = calculateTotal();

      if (!selectedCustomer.address || !selectedCustomer.city || 
          !selectedCustomer.state || !selectedCustomer.zip_code) {
        toast.error("Dados de endereço do cliente incompletos");
        return;
      }

      // Criar pedido com status inicial
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

      // Criar preferência do MercadoPago
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

  useEffect(() => {
    if (products.length > 0 && selectedProducts.length === 0) {
      const specificProduct = products[0];
      
      if (specificProduct) {
        setSelectedProducts([{
          ...specificProduct,
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
