
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
      // Só gerar se tivermos um pedido já criado
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
        
        // Simular dados baseados no método de pagamento
        if (paymentMethod === 'pix') {
          // Este é apenas um placeholder. No mundo real, você chamaria uma API para gerar o QR code
          setTimeout(() => {
            setCheckoutData({
              point_of_interaction: {
                transaction_data: {
                  qr_code: "00020101021226880014br.gov.bcb.pix2566qrcodes-pix.mercadopago.com/pd/v2/70c5989a-9a48-4b87-84c2-46936f9b8aa552040000530398654041.005802BR5925MERCADOPAGO PAGAMENTOS SA6009SAO PAULO62070503***6304BD31",
                  qr_code_base64: "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"
                }
              }
            });
            setLoading(false);
          }, 1000);
        } else {
          setCheckoutData(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao gerar dados de pagamento:", error);
        setLoading(false);
      }
    };
    
    if (paymentMethod === 'pix' || paymentMethod === 'boleto') {
      generatePaymentData();
    } else {
      setCheckoutData(null);
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
      
      // Se não tivermos dados de checkout para PIX/Boleto, gerá-los agora
      if ((paymentMethod === 'pix' || paymentMethod === 'boleto') && !checkoutData) {
        try {
          const checkoutResult = await createMercadoPagoCheckout(
            orderId!, 
            cartItems, 
            shippingFee, 
            discount
          );
          
          setCheckoutData(checkoutResult);
        } catch (error) {
          console.error("Erro ao gerar dados de pagamento:", error);
          toast.error("Erro ao processar dados de pagamento. Tente novamente.");
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
