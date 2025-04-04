
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

// Helper function to generate a unique order ID as a valid UUID
const generateUniqueOrderId = () => {
  // Generate a proper UUID v4
  return crypto.randomUUID();
};

// Função para salvar o pedido no banco de dados
export const saveOrder = async (
  orderId: string | null, 
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

    // Generate a new unique UUID if none is provided
    const finalOrderId = orderId || generateUniqueOrderId();

    console.log("Salvando pedido:", finalOrderId, "para usuário:", userId);

    // Garantir que o user_id seja explicitamente definido
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: finalOrderId,
        user_id: userId, // Garantir que o ID do usuário esteja definido
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
      // If we get a duplicate key error, try again with a new order ID
      if (orderError.code === '23505') {
        console.log("Conflito de ID de pedido, gerando novo ID...");
        return saveOrder(
          generateUniqueOrderId(),
          cartItems,
          shippingFee,
          discount,
          zipCode,
          paymentMethod,
          appliedVoucher
        );
      }
      console.error("Erro ao salvar pedido:", orderError);
      throw orderError;
    }

    // Criar registro de pagamento
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: finalOrderId,
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
    
    return finalOrderId;
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    throw error;
  }
};
