
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
      
      try {
        // Salvar o pedido no banco de dados
        await saveOrder(orderId!, cartItems, shippingFee, discount, zipCode, paymentMethod, appliedVoucher);
        console.log("Pedido salvo com sucesso no banco de dados");
        
        // Criar a preferência de pagamento no Mercado Pago
        if (paymentMethod === 'pix') {
          try {
            console.log("Iniciando criação de checkout do Mercado Pago para PIX");
            const mpResponse = await createMercadoPagoCheckout(
              orderId!, 
              cartItems, 
              shippingFee, 
              discount
            );
            
            console.log("Resposta do Mercado Pago:", mpResponse);
            
            if (mpResponse) {
              setCheckoutData(mpResponse);
              
              // Verificar se temos os dados do PIX
              if (mpResponse.point_of_interaction?.transaction_data?.qr_code) {
                console.log("QR Code PIX gerado com sucesso!");
              } else {
                console.error("QR Code PIX não foi gerado corretamente na resposta:", mpResponse);
                toast.error("Erro ao gerar o código PIX. Detalhes do pagamento estão incompletos.");
              }
            }
          } catch (mpError: any) {
            console.error("Erro detalhado ao criar checkout do Mercado Pago:", mpError);
            toast.error("Erro ao gerar o código PIX: " + (mpError.message || "Tente novamente"));
            // Não redirecionar em caso de erro no PIX, permitir tentar novamente
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
        // Se o erro for de chave duplicada, ignore o erro de salvar o pedido
        // mas continue com o processo de pagamento
        if (error && error.code === "23505") {
          console.log("Pedido já existe, continuando com o processo de pagamento");
          
          // Criar a preferência de pagamento no Mercado Pago para PIX
          if (paymentMethod === 'pix') {
            try {
              console.log("Iniciando criação de checkout do Mercado Pago para PIX");
              const mpResponse = await createMercadoPagoCheckout(
                orderId!, 
                cartItems, 
                shippingFee, 
                discount
              );
              
              console.log("Resposta do Mercado Pago:", mpResponse);
              
              if (mpResponse) {
                setCheckoutData(mpResponse);
                
                if (mpResponse.point_of_interaction?.transaction_data?.qr_code) {
                  console.log("QR Code PIX gerado com sucesso!");
                } else {
                  console.error("QR Code PIX não foi gerado corretamente na resposta:", mpResponse);
                  toast.error("Erro ao gerar o código PIX. Detalhes do pagamento estão incompletos.");
                }
              }
            } catch (mpError: any) {
              console.error("Erro detalhado ao criar checkout do Mercado Pago:", mpError);
              toast.error("Erro ao gerar o código PIX: " + (mpError.message || "Tente novamente"));
            }
          }
        } else {
          throw error; // Repasse outros erros
        }
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
