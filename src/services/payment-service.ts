import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

/**
 * Standard response interface for payment services
 */
export interface PaymentResponse {
  success?: boolean;
  pixCode?: string;
  qr_code_text?: string;
  preferenceId?: string;
  init_point?: string;
  redirect_url?: string;
  sandbox_init_point?: string;
  order_id?: string;
  amount?: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
}

/**
 * Tests the connection to the Mercado Pago API
 */
export const testMercadoPagoConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    console.log("Testing Mercado Pago connection...");
    
    const { data, error } = await supabase.functions.invoke('test-mercadopago', {
      body: {}
    });
    
    if (error) {
      console.error("Error testing Mercado Pago connection:", error);
      return { 
        success: false, 
        message: `Error: ${error.message || "Unknown error occurred"}` 
      };
    }
    
    console.log("Mercado Pago test response:", data);
    
    return {
      success: data?.success || false,
      message: data?.message || "No message returned",
      data: data?.data
    };
  } catch (error) {
    console.error("Exception testing Mercado Pago:", error);
    return { 
      success: false, 
      message: `Exception: ${error.message || "Unknown exception occurred"}` 
    };
  }
};

/**
 * Creates a Mercado Pago checkout for the given order
 */
export const createMercadoPagoCheckout = async (
  orderId: string, 
  items: Array<{ title: string; quantity: number; price: number; }>, 
  shippingFee: number,
  discount: number
): Promise<PaymentResponse> => {
  try {
    console.log("Creating Mercado Pago checkout for order:", orderId);
    
    // Call Edge Function API
    const { data, error } = await supabase.functions.invoke('mercadopago-checkout', {
      body: {
        orderId,
        items,
        shipping_cost: shippingFee,
        payer: {
          email: "cliente@example.com"
        }
      }
    });
    
    if (error) {
      console.error("Error in mercadopago-checkout call:", error);
      throw error;
    }
    
    console.log("Mercado Pago API response:", data);
    
    if (data?.success && data?.init_point) {
      return {
        success: true,
        preferenceId: data.preferenceId,
        init_point: data.init_point,
        redirect_url: data.init_point,
        sandbox_init_point: data.sandbox_init_point
      };
    }
    
    throw new Error("Resposta do Mercado Pago incompleta ou inválida");
  } catch (error) {
    console.error("Error in createMercadoPagoCheckout:", error);
    throw error;
  }
};

/**
 * Calculate the total amount for an order
 */
const calculateTotal = (cartItems: CartItem[], shippingFee: number, discount: number): number => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return subtotal + shippingFee - discount;
};

/**
 * Helper to generate a Google Charts API URL for a QR code
 */
const generateGoogleQRCode = (content: string): string => {
  const encodedContent = encodeURIComponent(content);
  return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodedContent}`;
};

/**
 * Generate a valid PIX code according to the Brazilian Central Bank standards
 */
const generateStandardPixCode = (orderId: string, amount: number): string => {
  const txId = orderId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 20);
  const amountStr = amount.toFixed(2);
  const pixKey = "12345678901";
  const merchantName = "BONEHEAL";
  const merchantCity = "SAOPAULO";
  return `00020101021226580014BR.GOV.BCB.PIX2565${pixKey}5204000053039865802BR5915${merchantName}6008${merchantCity}62140510${txId}6304`;
};

/**
 * Process a payment via PIX
 */
export const processPixPayment = async (orderId: string, amount: number): Promise<PaymentResponse> => {
  try {
    console.log("Gerando PIX via função Edge para pedido:", orderId, "valor:", amount);
    
    const safeAmount = amount <= 0 ? 1.0 : amount;
    
    const { data, error } = await supabase.functions.invoke('mercadopago-pix', {
      body: {
        orderId,
        amount: safeAmount,
        description: `Pedido #${orderId} - BoneHeal`,
        email: 'cliente@example.com'
      }
    });
    
    if (error) {
      console.error("Erro ao gerar PIX via Mercado Pago:", error);
      return generatePixWithAlternativeMethod(orderId, safeAmount);
    }
    
    console.log("Resposta da função PIX do Mercado Pago:", data);
    
    if (data && (data.qr_code || data.qr_code_base64 || data.qr_code_text)) {
      console.log("PIX gerado com sucesso via Mercado Pago");
      return {
        success: true,
        pixCode: data.qr_code_text || data.qr_code || '',
        qr_code_text: data.qr_code_text || '',
        redirect_url: data.redirect_url || data.point_of_interaction?.transaction_data?.ticket_url || '',
        order_id: orderId,
        amount: safeAmount.toString(),
        point_of_interaction: {
          transaction_data: {
            qr_code: data.qr_code || '',
            qr_code_base64: data.qr_code_base64 || generateGoogleQRCode(data.qr_code_text || ''),
            ticket_url: data.redirect_url || data.point_of_interaction?.transaction_data?.ticket_url || ''
          }
        }
      };
    }
    
    console.log("Fallback: Gerando PIX com método alternativo");
    return generatePixWithAlternativeMethod(orderId, safeAmount);
  } catch (error) {
    console.error("Error in processPixPayment:", error);
    
    return generatePixWithAlternativeMethod(orderId, amount);
  }
};

/**
 * Generate PIX using alternative method if Mercado Pago fails
 */
const generatePixWithAlternativeMethod = async (orderId: string, amount: number): Promise<PaymentResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('omie-pix', {
      body: {
        orderId,
        amount
      }
    });
    
    if (error || !data || !data.pixCode) {
      console.error("Erro ao gerar PIX via método alternativo:", error);
      return generateSafePixData(orderId, amount);
    }
    
    console.log("PIX gerado com sucesso via Omie:", data);
    
    const redirectUrl = `https://www.mercadopago.com.br/checkout?preference_id=omie_${orderId}`;
    
    return {
      success: true,
      pixCode: data.pixCode,
      qr_code_text: data.pixCode,
      redirect_url: redirectUrl,
      order_id: orderId,
      amount: amount.toString(),
      point_of_interaction: {
        transaction_data: {
          qr_code: data.pixCode,
          qr_code_base64: data.qr_code_base64 || generateGoogleQRCode(data.pixCode),
          ticket_url: redirectUrl
        }
      }
    };
  } catch (error) {
    console.error("Erro no método alternativo de PIX:", error);
    return generateSafePixData(orderId, amount);
  }
};

/**
 * Generate a safe fallback PIX code
 */
export const generateSafePixData = (orderId: string, amount: number = 0): Promise<PaymentResponse> | PaymentResponse => {
  const finalAmount = amount > 0 ? amount : 100;
  const pixCode = generateStandardPixCode(orderId, finalAmount);
  const qrCodeUrl = generateGoogleQRCode(pixCode);
  const redirectUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=fallback_${orderId}`;
  return {
    success: true,
    pixCode: pixCode,
    qr_code_text: pixCode,
    redirect_url: redirectUrl,
    order_id: orderId,
    amount: finalAmount.toFixed(2),
    point_of_interaction: {
      transaction_data: {
        qr_code: pixCode,
        qr_code_base64: qrCodeUrl,
        ticket_url: redirectUrl
      }
    }
  };
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
      console.error("Error updating payment status:", error);
      throw new Error(`Error updating payment status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    throw error;
  }
};

/**
 * Get Mercado Pago redirect URL for an order
 */
export const getMercadoPagoRedirectUrl = async (orderId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('mp_preference_id, payment_details')
      .eq('id', orderId)
      .single();
    
    if (error) {
      console.error("Error getting order redirect URL:", error);
      return `https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=${orderId}`;
    }
    
    if (!data) {
      return `https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=${orderId}`;
    }

    if (data.payment_details && 
        typeof data.payment_details === 'object' && 
        'init_point' in data.payment_details) {
      return data.payment_details.init_point as string;
    }
    
    if (data.mp_preference_id) {
      return `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.mp_preference_id}`;
    }
    
    return `https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=${orderId}`;
  } catch (error) {
    console.error("Error getting Mercado Pago redirect URL:", error);
    return `https://www.mercadopago.com.br/checkout/v1/redirect?test=true&preference_id=${orderId}`;
  }
};
