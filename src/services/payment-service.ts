
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

/**
 * Creates a Mercado Pago checkout for the given order
 */
export const createMercadoPagoCheckout = async (
  orderId: string, 
  cartItems: CartItem[], 
  shippingFee: number,
  discount: number
) => {
  try {
    console.log("Creating Mercado Pago checkout for order:", orderId);
    console.log("Cart items:", cartItems.length);
    console.log("Shipping fee:", shippingFee);
    console.log("Discount:", discount);

    // Format the items for Mercado Pago
    const items = cartItems.map(item => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: Number(item.price),
      picture_url: item.image ? `${window.location.origin}/images/${item.image}` : undefined
    }));

    // Call the Edge Function to create the checkout
    const { data, error } = await supabase.functions.invoke('mercadopago-checkout', {
      body: {
        order_id: orderId,
        items,
        shipping_cost: Number(shippingFee),
        discount: Number(discount)
      }
    });

    if (error) {
      console.error("Error calling Mercado Pago checkout function:", error);
      throw new Error(`Error creating Mercado Pago checkout: ${error.message}`);
    }

    console.log("Mercado Pago checkout response:", data);
    return data;
  } catch (error) {
    console.error("Error in createMercadoPagoCheckout:", error);
    throw error;
  }
};

/**
 * Process a payment via PIX
 */
export const processPixPayment = async (orderId: string, amount: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('omie-pix', {
      body: { 
        orderId,
        amount
      }
    });

    if (error) {
      throw new Error(`Error processing PIX payment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in processPixPayment:", error);
    throw error;
  }
};

/**
 * Update the payment status of an order
 */
export const updatePaymentStatus = async (orderId: string, status: string, details?: any) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: status,
        status: status === 'paid' ? 'processing' : status === 'failed' ? 'cancelled' : 'pending',
        updated_at: new Date().toISOString(),
        payment_details: details
      })
      .eq('id', orderId)
      .select();

    if (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    throw error;
  }
};
