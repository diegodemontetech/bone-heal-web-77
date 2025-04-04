
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
    // Ensure shippingFee is numeric
    const numericShippingFee = typeof shippingFee === 'number' ? shippingFee : parseFloat(String(shippingFee)) || 0;
    console.log("Mercado Pago checkout - shipping fee:", numericShippingFee);
    
    if (isNaN(numericShippingFee) || numericShippingFee <= 0) {
      console.error("Valor de frete inválido:", shippingFee);
      throw new Error("Valor de frete inválido. Por favor, recalcule o frete.");
    }
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal + numericShippingFee - discount);
    
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
        shipping_cost: numericShippingFee,
        discount: discount,
        payment_method: 'pix',
        payer,
        notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
        external_reference: orderId
      }
    });
    
    console.log("Resposta do checkout MP:", data, error);
    
    if (error) {
      console.error("Erro do Mercado Pago:", error);
      throw error;
    }
    
    if (!data) {
      console.error("Dados do Mercado Pago não retornados");
      throw new Error("Não foi possível gerar o checkout");
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao criar checkout do Mercado Pago:", error);
    
    // Tente gerar PIX via Omie como fallback
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userSession = sessionData?.session;
      
      if (!userSession?.user) {
        throw new Error("Usuário não está autenticado");
      }
      
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const numericShippingFee = typeof shippingFee === 'number' ? shippingFee : parseFloat(String(shippingFee)) || 0;
      const total = Math.max(0, subtotal + numericShippingFee - discount);
      
      console.log("Tentando fallback via Omie PIX devido a falha no Mercado Pago");
      const pixData = await generateOmiePix(orderId, total);
      
      // Formatar resposta para compatibilidade com o formato do Mercado Pago
      return {
        point_of_interaction: {
          transaction_data: {
            qr_code: pixData.qr_code_text,
            qr_code_base64: pixData.qr_code
          }
        }
      };
    } catch (fallbackError) {
      console.error("Erro também no fallback Omie:", fallbackError);
      throw error; // Lançar o erro original do Mercado Pago
    }
  }
};

// Função para gerar PIX via Omie
export const generateOmiePix = async (
  orderId: string,
  total: number
) => {
  try {
    if (!orderId || !total || total <= 0) {
      throw new Error("Parâmetros inválidos para geração de PIX");
    }
    
    console.log("Gerando PIX via Omie para ordem:", orderId, "valor:", total);
    
    const { data, error } = await supabase.functions.invoke("omie-pix", {
      body: { 
        orderId: orderId,
        amount: total
      }
    });
    
    if (error) {
      console.error("Erro ao gerar PIX via Omie:", error);
      throw error;
    }
    
    if (!data || (!data.pixCode && !data.pixLink)) {
      console.error("Dados do Omie PIX não retornados ou inválidos");
      throw new Error("Não foi possível gerar o código PIX");
    }
    
    return {
      qr_code: data.pixQrCodeImage || "",
      qr_code_text: data.pixCode || ""
    };
  } catch (error) {
    console.error("Erro ao gerar PIX via Omie:", error);
    throw error;
  }
};
