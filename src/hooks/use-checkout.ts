
import { useState } from "react";
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
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
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

      setLoading(true);
      console.log("Iniciando processo de checkout transparente...");

      // Gerar ID único para o pedido
      const newOrderId = crypto.randomUUID();
      setOrderId(newOrderId);
      
      console.log("Novo pedido criado:", newOrderId);
      
      // Salvar o pedido no banco de dados
      await saveOrder(newOrderId, cartItems, shippingFee, discount, zipCode, paymentMethod, appliedVoucher);
      console.log("Pedido salvo com sucesso no banco de dados");
      
      // Criar checkout do Mercado Pago
      const checkoutData = await createMercadoPagoCheckout(
        newOrderId, 
        cartItems, 
        shippingFee, 
        discount
      );
      
      console.log("Dados de checkout recebidos:", checkoutData);
      setCheckoutData(checkoutData);
      
      // Limpar carrinho após finalizar o checkout
      localStorage.removeItem('cart');
      
      // Redirecionar para a página de sucesso
      navigate("/checkout/success", { 
        state: { 
          orderId: newOrderId,
          paymentMethod
        }
      });
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar o checkout: " + (error.message || "Tente novamente"));
      setLoading(false);
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
