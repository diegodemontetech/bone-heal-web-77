
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";
import { saveOrder } from "@/services/order-service";
import { createMercadoPagoCheckout } from "@/services/payment-service";

export function useCheckout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
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
        
        // Process payment based on selected method
        if (paymentMethod === 'pix') {
          // Try Mercado Pago first
          try {
            const mpResponse = await createMercadoPagoCheckout(
              savedOrderId, 
              cartItems, 
              numericShippingFee, 
              discount
            );
            
            console.log("Resposta do Mercado Pago:", mpResponse);
            
            if (mpResponse) {
              setCheckoutData(mpResponse);
              return;
            }
          } catch (mpError) {
            console.error("Erro ao criar checkout do Mercado Pago:", mpError);
            
            // Fall back to Omie PIX if Mercado Pago fails
            try {
              console.log("Tentando gerar PIX pelo Omie...");
              const { data: omiePix, error: omieError } = await supabase.functions.invoke("omie-pix", {
                body: { 
                  orderId: savedOrderId,
                  amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + numericShippingFee - discount
                }
              });
              
              if (omieError) {
                console.error("Erro ao gerar PIX pelo Omie:", omieError);
                toast.error("Erro ao gerar o código PIX. Tente novamente.");
                return;
              }
              
              if (omiePix && (omiePix.pixCode || omiePix.pixLink)) {
                console.log("PIX gerado pelo Omie:", omiePix);
                setCheckoutData({
                  qr_code: omiePix.pixQrCodeImage || "",
                  qr_code_text: omiePix.pixCode || ""
                });
                return;
              }
            } catch (omieError) {
              console.error("Erro completo ao gerar PIX pelo Omie:", omieError);
              toast.error("Erro ao gerar o código PIX. Tente novamente.");
            }
          }
          
          // If both payment methods failed
          toast.error("Não foi possível gerar o código PIX. Por favor, tente novamente mais tarde ou escolha outra forma de pagamento.");
        } else {
          // For non-PIX payment methods, redirect to success page
          localStorage.removeItem('cart');
          navigate("/checkout/success", { 
            state: { 
              orderId: savedOrderId,
              paymentMethod
            }
          });
        }
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
