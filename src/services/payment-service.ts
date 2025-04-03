
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

// Função para criar checkout do Mercado Pago
export const createMercadoPagoCheckout = async (
  orderId: string,
  cartItems: CartItem[],
  shippingFee: number,
  discount: number
) => {
  try {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal + shippingFee - discount);
    
    // Verificar autenticação
    const { data: sessionData } = await supabase.auth.getSession();
    const userSession = sessionData?.session;
    
    if (!userSession?.user) {
      console.error("Usuário não autenticado ao criar checkout");
      throw new Error("Usuário não está autenticado");
    }
    
    console.log("Criando checkout do Mercado Pago para ordem:", orderId);
    
    const items = cartItems.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price
    }));
    
    // Obter dados do perfil do usuário para o pagamento
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, phone, cpf, address, zip_code')
      .eq('id', userSession.user.id)
      .single();
    
    const payer = {
      email: userSession.user.email,
      name: profileData?.full_name || userSession.user.user_metadata?.name || "Cliente",
      identification: {
        type: "CPF",
        number: profileData?.cpf || "00000000000"
      }
    };
    
    // Chamar a edge function do Mercado Pago para gerar o checkout
    const { data, error } = await supabase.functions.invoke("mercadopago-checkout", {
      body: {
        orderId,
        items,
        shipping_cost: shippingFee,
        discount: discount,
        payment_method: 'pix',
        payer,
        notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
        external_reference: orderId
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
