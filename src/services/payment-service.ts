
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

// Function to create Mercado Pago checkout
export const createMercadoPagoCheckout = async (
  orderId: string,
  cartItems: CartItem[],
  shippingFee: number,
  discount: number
) => {
  try {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal + shippingFee - discount);
    
    // Verify authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const userSession = sessionData?.session;
    
    if (!userSession?.user) {
      console.error("User not authenticated when creating checkout");
      throw new Error("User is not authenticated");
    }
    
    console.log("Creating Mercado Pago checkout for order:", orderId);
    
    const items = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    
    // Get user profile data for payment
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
    
    // Call the Mercado Pago edge function to generate checkout
    const { data, error } = await supabase.functions.invoke("mercadopago-checkout", {
      body: {
        orderId,
        items,
        shipping_cost: shippingFee,
        discount: discount,
        payment_method: 'pix',
        payer,
        notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
        external_reference: orderId,
        // Set an expiration date for the PIX code (30 minutes from now)
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    });
    
    console.log("MP checkout response:", data, error);
    
    if (error) {
      console.error("Error in MP checkout:", error);
      throw error;
    }
    
    if (!data) {
      console.error("Empty response from MP checkout");
      throw new Error("Could not generate checkout");
    }
    
    return data;
  } catch (error) {
    console.error("Error creating Mercado Pago checkout:", error);
    throw error;
  }
};
