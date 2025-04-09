
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";
import { saveOrder } from "@/services/order-service";
import { createMercadoPagoCheckout } from "@/services/payment-service";

// Define a consistent type for checkout data
export interface CheckoutData extends Object {
  // Propriedades extras podem ser adicionadas aqui
  init_point?: string;
}

export function useCheckout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("standard");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const processingRef = useRef(false);

  // Generate a UUID for the order ID on initialization
  useEffect(() => {
    if (!orderId) {
      const uuid = crypto.randomUUID();
      setOrderId(uuid);
      console.log("Generated new order UUID:", uuid);
    }
  }, [orderId]);

  // Main checkout function
  const handleCheckout = async (
    cartItems: CartItem[],
    zipCode: string,
    shippingFee: number,
    discount: number,
    appliedVoucher: any
  ) => {
    // Prevent multiple concurrent checkout attempts
    if (processingRef.current) {
      console.log("Checkout already in progress, ignoring duplicate request");
      return;
    }

    if (!cartItems.length) {
      toast.error("Seu carrinho está vazio.");
      navigate("/products");
      return;
    }

    // Ensure shippingFee is a valid number
    const numericShippingFee = typeof shippingFee === 'number' && !isNaN(shippingFee) 
      ? shippingFee 
      : parseFloat(String(shippingFee)) || 0;
    
    console.log("Shipping fee at checkout (numeric):", numericShippingFee);

    try {
      processingRef.current = true;
      setProcessingPayment(true);
      setLoading(true);

      // Verify user authentication
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (sessionError) {
        console.error("Erro ao verificar sessão:", sessionError);
        toast.error("Ocorreu um erro ao verificar sua autenticação. Tente novamente.");
        return;
      }
      
      if (!userId) {
        console.error("Usuário não autenticado no handleCheckout");
        toast.error("É necessário estar logado para finalizar a compra.");
        navigate("/login");
        return;
      }

      if (!zipCode) {
        toast.error("Selecione uma opção de frete para continuar.");
        return;
      }
      
      if (!paymentMethod) {
        toast.error("Selecione uma forma de pagamento para continuar.");
        return;
      }

      console.log("Processando pagamento via", paymentMethod, "para o pedido", orderId);
      
      // Save order to database with the correct shipping fee
      try {
        const savedOrderId = await saveOrder(orderId, cartItems, numericShippingFee, discount, zipCode, paymentMethod, appliedVoucher);
        console.log("Pedido salvo com sucesso no banco de dados com ID:", savedOrderId);
        
        // Update order ID if a new one was generated
        if (savedOrderId !== orderId) {
          setOrderId(savedOrderId);
        }
        
        // Process direct redirect to Mercado Pago
        const mpItems = cartItems.map(item => ({
          title: item.name,
          quantity: item.quantity,
          price: item.price
        }));
        
        // Redirect to Mercado Pago
        navigate(`/checkout/mercadopago`, {
          state: {
            orderId: savedOrderId,
            items: mpItems,
            shippingFee: numericShippingFee,
            discount: discount,
            email: "cliente@example.com" // Ideally would use actual user email
          }
        });
      } catch (saveError) {
        console.error("Erro ao salvar o pedido:", saveError);
        toast.error("Erro ao salvar o pedido. Por favor, tente novamente.");
      }
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar o checkout: " + (error.message || "Tente novamente"));
    } finally {
      setLoading(false);
      setProcessingPayment(false);
      processingRef.current = false;
    }
  };

  return {
    loading,
    paymentMethod,
    setPaymentMethod,
    handleCheckout,
    orderId,
    checkoutData
  };
}
