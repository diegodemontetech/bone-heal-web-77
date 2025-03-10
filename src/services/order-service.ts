
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

// Função para salvar o pedido no banco de dados
export const saveOrder = async (
  orderId: string, 
  cartItems: CartItem[], 
  shippingFee: number, 
  discount: number, 
  zipCode: string, 
  paymentMethod: string,
  appliedVoucher: any
) => {
  try {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total_amount = Math.max(0, subtotal + shippingFee - discount);

    // Verificar autenticação
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.error("Usuário não autenticado ao salvar pedido");
      throw new Error("É necessário estar logado para finalizar a compra");
    }

    console.log("Salvando pedido:", orderId, "para usuário:", userId);

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
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
