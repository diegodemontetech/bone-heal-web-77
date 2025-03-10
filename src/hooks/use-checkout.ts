
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";

export function useCheckout() {
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Função para salvar o pedido no banco de dados
  const saveOrder = async (
    orderId: string, 
    cartItems: CartItem[], 
    shippingFee: number, 
    discount: number, 
    zipCode: string, 
    appliedVoucher: any
  ) => {
    try {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const total_amount = Math.max(0, subtotal + shippingFee - discount);

      // Verificar autenticação
      if (!session?.user?.id) {
        console.error("Usuário não autenticado ao salvar pedido");
        throw new Error("É necessário estar logado para finalizar a compra");
      }

      console.log("Salvando pedido:", orderId, "para usuário:", session.user.id);

      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: session.user.id,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          })),
          shipping_fee: shippingFee,
          discount: discount,
          subtotal: subtotal,
          total_amount: total_amount,
          status: 'pending',
          shipping_address: {
            zip_code: zipCode
          },
          payment_method: paymentMethod
        });

      if (orderError) {
        console.error("Erro ao salvar pedido:", orderError);
        throw orderError;
      }

      // Criar registro de pagamento
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          status: 'pending',
          amount: total_amount,
          payment_method: paymentMethod
        });

      if (paymentError) {
        console.error("Erro ao criar registro de pagamento:", paymentError);
        throw paymentError;
      }

      if (appliedVoucher) {
        await supabase
          .from('vouchers')
          .update({ current_uses: (appliedVoucher.current_uses || 0) + 1 })
          .eq('id', appliedVoucher.id);
      }
      
      return orderId;
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      throw error;
    }
  };

  // Função para criar checkout do Mercado Pago
  const createMercadoPagoCheckout = async (
    orderId: string,
    cartItems: CartItem[],
    shippingFee: number,
    discount: number
  ) => {
    try {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const total = Math.max(0, subtotal + shippingFee - discount);
      
      if (!session?.user) {
        console.error("Usuário não autenticado ao criar checkout");
        throw new Error("Usuário não está autenticado");
      }
      
      console.log("Criando checkout do Mercado Pago para ordem:", orderId);
      
      const items = cartItems.map(item => ({
        title: item.name,
        quantity: item.quantity,
        price: item.price,
        unit_price: item.price
      }));
      
      const { data, error } = await supabase.functions.invoke("mercadopago-checkout", {
        body: {
          orderId,
          items,
          shipping_cost: shippingFee,
          buyer: {
            email: session.user.email,
            name: session.user.user_metadata?.name || "Cliente"
          },
          paymentType: 'transparent'
        }
      });
      
      console.log("Resposta do checkout MP:", data, error);
      
      if (error) throw error;
      
      if (!data) {
        throw new Error("Não foi possível gerar o checkout");
      }
      
      return data;
    } catch (error) {
      console.error("Erro ao criar checkout do Mercado Pago:", error);
      throw error;
    }
  };

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
    if (!session?.user) {
      console.error("Usuário não autenticado no handleCheckout");
      toast.error("É necessário estar logado para finalizar a compra.");
      navigate("/login");
      return;
    }

    if (!zipCode) {
      toast.error("Selecione uma opção de frete para continuar.");
      return;
    }

    try {
      setLoading(true);
      console.log("Iniciando processo de checkout transparente...");

      // Gerar ID único para o pedido
      const newOrderId = crypto.randomUUID();
      setOrderId(newOrderId);
      
      console.log("Novo pedido criado:", newOrderId);
      
      // Salvar o pedido no banco de dados
      await saveOrder(newOrderId, cartItems, shippingFee, discount, zipCode, appliedVoucher);
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
