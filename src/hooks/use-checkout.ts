
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";
import { saveOrder } from "@/services/order-service";
import { createMercadoPagoCheckout } from "@/services/payment-service";

export function useCheckout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Gerar ID único para o pedido ao iniciar
  useEffect(() => {
    if (!orderId) {
      setOrderId(crypto.randomUUID());
    }
  }, [orderId]);

  // Gerar QR Code do PIX ou link do boleto ao mudar o método de pagamento
  useEffect(() => {
    const generatePaymentData = async () => {
      // Só gerar se tivermos um pedido já criado e não temos dados de pagamento ainda
      if (!orderId || processingPayment || checkoutData) return;
      
      // Verificar sessão para garantir autenticação
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        console.log("Usuário não autenticado, não gerando dados de pagamento");
        return;
      }
      
      try {
        console.log(`Gerando dados para pagamento com ${paymentMethod}`);
        setLoading(true);
        
        // Para PIX, chamar a edge function que gera o QR code
        if (paymentMethod === 'pix') {
          try {
            const { data, error } = await supabase.functions.invoke("omie-pix", {
              body: { orderId }
            });
            
            if (error) throw error;
            
            if (data) {
              setCheckoutData({
                point_of_interaction: {
                  transaction_data: {
                    qr_code: data.pixCode,
                    qr_code_base64: "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"
                  }
                }
              });
            }
          } catch (error) {
            console.error("Erro ao gerar QR Code PIX:", error);
            toast.error("Erro ao gerar QR Code PIX. Tente novamente.");
            setCheckoutData(null);
          }
        } else if (paymentMethod === 'boleto') {
          // Código para gerar boleto
          // ... implementação futura ...
          setCheckoutData(null);
        } else {
          setCheckoutData(null);
        }
      } catch (error) {
        console.error("Erro ao gerar dados de pagamento:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Limpar dados de checkout ao mudar o método
    if (paymentMethod !== 'pix' && paymentMethod !== 'boleto') {
      setCheckoutData(null);
    } else if ((paymentMethod === 'pix' || paymentMethod === 'boleto') && !checkoutData) {
      generatePaymentData();
    }
  }, [paymentMethod, orderId, processingPayment, checkoutData]);

  // Função principal para processar o checkout
  const handleCheckout = async (
    cartItems: CartItem[],
    zipCode: string,
    shippingFee: number,
    discount: number,
    appliedVoucher: any
  ) => {
    if (!cartItems.length) {
      toast.error("Seu carrinho está vazio.");
      navigate("/products");
      return;
    }

    // Verificação de autenticação
    try {
      // Verificar sessão diretamente para garantir
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

      setProcessingPayment(true);
      setLoading(true);
      console.log("Processando pagamento via", paymentMethod, "para o pedido", orderId);
      
      // Para PIX, verificar se temos dados de checkout. Se não, gerá-los agora
      if (paymentMethod === 'pix' && !checkoutData) {
        try {
          // Chamar a edge function para gerar o PIX
          const { data, error } = await supabase.functions.invoke("omie-pix", {
            body: { orderId }
          });
          
          if (error) throw error;
          
          if (data) {
            setCheckoutData({
              point_of_interaction: {
                transaction_data: {
                  qr_code: data.pixCode,
                  qr_code_base64: "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"
                }
              }
            });
          }
        } catch (error) {
          console.error("Erro ao gerar QR Code PIX:", error);
          toast.error("Erro ao gerar QR Code PIX. Tente novamente.");
          setLoading(false);
          setProcessingPayment(false);
          return;
        }
      }
      
      // Salvar o pedido no banco de dados
      await saveOrder(orderId!, cartItems, shippingFee, discount, zipCode, paymentMethod, appliedVoucher);
      console.log("Pedido salvo com sucesso no banco de dados");
      
      // Limpar carrinho após finalizar o checkout
      localStorage.removeItem('cart');
      
      // Redirecionar para a página de sucesso
      navigate("/checkout/success", { 
        state: { 
          orderId: orderId,
          paymentMethod
        }
      });
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar o checkout: " + (error.message || "Tente novamente"));
      setLoading(false);
      setProcessingPayment(false);
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
