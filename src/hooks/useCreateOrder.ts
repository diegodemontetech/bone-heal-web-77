
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ShippingCalculationRate } from "@/types/shipping";

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);
  const navigate = useNavigate();

  const validateOrderData = (selectedCustomer: any, selectedProducts: any[]) => {
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

  const calculateTotal = (selectedProducts: any[]) => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const createOrder = async (
    selectedCustomer: any, 
    selectedProducts: any[],
    shippingOption: ShippingCalculationRate | null
  ) => {
    try {
      console.log("Iniciando criação do pedido...");
      setLoading(true);

      try {
        validateOrderData(selectedCustomer, selectedProducts);
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

      const subtotal = calculateTotal(selectedProducts);
      const shippingFee = shippingOption?.rate || 0;
      const total = subtotal + shippingFee;

      // Valores padrão para endereço, caso não exista
      const shippingAddress = {
        address: selectedCustomer.address || "Endereço não informado",
        city: selectedCustomer.city || "Cidade não informada",
        state: selectedCustomer.state || "UF",
        zip_code: selectedCustomer.zip_code || shippingOption?.zipCode || "00000-000"
      };

      // Informações de frete
      const shippingInfo = shippingOption ? {
        service_type: shippingOption.service_type,
        carrier: shippingOption.name,
        cost: shippingOption.rate,
        estimated_days: shippingOption.delivery_days
      } : null;

      console.log("Criando pedido na base de dados...");
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: selectedCustomer.id,
          items: orderItems,
          payment_method: paymentMethod,
          shipping_fee: shippingFee,
          total_amount: total,
          subtotal: subtotal,
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
              shipping_cost: shippingFee,
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
      navigate(`/admin/vendas`);
      
      return order;
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao criar pedido: " + (error.message || "Erro desconhecido"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createOrder,
    calculateTotal,
    paymentMethod,
    setPaymentMethod,
    shippingFee,
    setShippingFee,
    selectedShipping,
    setSelectedShipping
  };
};
