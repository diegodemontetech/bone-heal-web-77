
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

    // Ensure shippingFee is a number and log it for debugging
    const numericShippingFee = typeof shippingFee === 'number' ? shippingFee : parseFloat(String(shippingFee)) || 0;
    console.log("Shipping fee at checkout (numeric):", numericShippingFee);

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
      
      // Salvar o pedido no banco de dados com o valor correto do frete
      const savedOrderId = await saveOrder(orderId, cartItems, numericShippingFee, discount, zipCode, paymentMethod, appliedVoucher);
      console.log("Pedido salvo com sucesso no banco de dados com ID:", savedOrderId);
      
      // Atualizar o ID do pedido se foi gerado um novo
      if (savedOrderId !== orderId) {
        setOrderId(savedOrderId);
      }
      
      // Criar a preferência de pagamento no Mercado Pago
      if (paymentMethod === 'pix') {
        let pixGenerated = false;
        
        try {
          // Primeiro tenta o Mercado Pago
          const mpResponse = await createMercadoPagoCheckout(
            savedOrderId, 
            cartItems, 
            numericShippingFee, 
            discount
          );
          
          console.log("Resposta do Mercado Pago:", mpResponse);
          
          if (mpResponse) {
            setCheckoutData(mpResponse);
            pixGenerated = true;
          }
        } catch (mpError) {
          console.error("Erro ao criar checkout do Mercado Pago:", mpError);
          // Falha do Mercado Pago - continuamos para o fallback Omie
        }
        
        // Se o MP falhou, tentamos o Omie PIX
        if (!pixGenerated) {
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
              // Formatar os dados de acordo com o formato esperado pelo QRCodeDisplay
              setCheckoutData({
                qr_code: omiePix.pixQrCodeImage || "",
                qr_code_text: omiePix.pixCode || ""
              });
              pixGenerated = true;
            }
          } catch (omieError) {
            console.error("Erro completo ao gerar PIX pelo Omie:", omieError);
            toast.error("Erro ao gerar o código PIX. Tente novamente.");
          }
        }

        // Se ambos os métodos falharam, exibir erro
        if (!pixGenerated) {
          toast.error("Não foi possível gerar o código PIX. Por favor, tente novamente mais tarde ou escolha outra forma de pagamento.");
        }
      }
      
      // Redirecionar para a página de sucesso para métodos não-PIX
      if (paymentMethod !== 'pix') {
        localStorage.removeItem('cart');
        navigate("/checkout/success", { 
          state: { 
            orderId: savedOrderId,
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
