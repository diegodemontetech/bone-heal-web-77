
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
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Gerar ID único para o pedido ao iniciar
  useEffect(() => {
    if (!orderId) {
      setOrderId(crypto.randomUUID());
    }
  }, [orderId]);

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

    // Log shipping fee to debug
    console.log("Shipping fee at checkout:", shippingFee);

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
      
      // Salvar o pedido no banco de dados
      await saveOrder(orderId!, cartItems, shippingFee, discount, zipCode, paymentMethod, appliedVoucher);
      console.log("Pedido salvo com sucesso no banco de dados");
      
      // Criar a preferência de pagamento no Mercado Pago
      if (paymentMethod === 'pix') {
        try {
          // Primeiro tenta o Mercado Pago
          const mpResponse = await createMercadoPagoCheckout(
            orderId!, 
            cartItems, 
            shippingFee, 
            discount
          );
          
          console.log("Resposta do Mercado Pago:", mpResponse);
          
          if (mpResponse) {
            setCheckoutData(mpResponse);
          }
        } catch (mpError) {
          console.error("Erro ao criar checkout do Mercado Pago:", mpError);
          
          // Fallback para a função Omie PIX se o Mercado Pago falhar
          try {
            console.log("Tentando gerar PIX pelo Omie...");
            const { data: omiePix, error: omieError } = await supabase.functions.invoke("omie-pix", {
              body: { orderId: orderId }
            });
            
            if (omieError) {
              console.error("Erro ao gerar PIX pelo Omie:", omieError);
              toast.error("Erro ao gerar o código PIX. Tente novamente.");
              return;
            }
            
            if (omiePix && (omiePix.pixCode || omiePix.pixLink)) {
              console.log("PIX gerado pelo Omie:", omiePix);
              // Formatar os dados de acordo com o formato esperado pelo QRCodeDisplay
              setCheckoutData({
                qr_code: omiePix.pixQrCodeImage || "",
                qr_code_text: omiePix.pixCode || ""
              });
            } else {
              toast.error("Erro ao gerar o código PIX. Tente novamente.");
            }
          } catch (omieError) {
            console.error("Erro completo ao gerar PIX pelo Omie:", omieError);
            toast.error("Erro ao gerar o código PIX. Tente novamente.");
          }
        }
      }
      
      // Redirecionar para a página de sucesso para métodos não-PIX
      if (paymentMethod !== 'pix') {
        localStorage.removeItem('cart');
        navigate("/checkout/success", { 
          state: { 
            orderId: orderId,
            paymentMethod
          }
        });
      }
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar o checkout: " + (error.message || "Tente novamente"));
    } finally {
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
