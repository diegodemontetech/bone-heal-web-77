
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MERCADOPAGO_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!MERCADOPAGO_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse payload
    const payload = await req.json();
    
    console.log('Webhook recebido:', JSON.stringify(payload));
    
    // Only process 'payment' type notifications
    if (payload.type !== 'payment') {
      return new Response(
        JSON.stringify({ success: true, message: 'Notification type not processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get payment details from MercadoPago
    const paymentId = payload.data.id;
    const payment = await getPaymentDetails(paymentId, MERCADOPAGO_TOKEN);
    
    if (!payment) {
      throw new Error(`Payment details not found for payment ID: ${paymentId}`);
    }
    
    // Extract order ID from external reference
    const orderId = payment.external_reference;
    
    if (!orderId) {
      throw new Error('Order ID not found in external_reference');
    }
    
    // Map MP status to our internal status
    const status = mapPaymentStatus(payment.status);
    
    // Update order status
    await updateOrderStatus(supabase, orderId, status, payment);
    
    // If payment is approved, also sync with Omie
    if (status === 'completed') {
      await syncWithOmie(supabase, orderId, payment);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Payment ${paymentId} processed. Order ${orderId} updated to ${status}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 200, // Always return 200 to avoid MP retrying the webhook
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Function to get payment details from MercadoPago
async function getPaymentDetails(paymentId: string, accessToken: string) {
  try {
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      throw new Error(`MercadoPago API error: ${errorText}`);
    }
    
    return await mpResponse.json();
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
}

// Function to map MercadoPago status to our internal status
function mapPaymentStatus(mpStatus: string): string {
  const statusMap: Record<string, string> = {
    'approved': 'completed',
    'authorized': 'pending',
    'in_process': 'pending',
    'in_mediation': 'pending',
    'rejected': 'failed',
    'cancelled': 'failed',
    'refunded': 'refunded',
    'charged_back': 'refunded'
  };
  
  return statusMap[mpStatus] || 'pending';
}

// Function to update order status
async function updateOrderStatus(supabase: any, orderId: string, status: string, paymentData: any) {
  try {
    // 1. Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: status,
        status: status === 'completed' ? 'processing' : (status === 'failed' ? 'cancelled' : 'pending'),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (orderError) throw orderError;
    
    // 2. Create or update payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .upsert({
        order_id: orderId,
        provider_payment_id: paymentData.id.toString(),
        amount: paymentData.transaction_amount,
        payment_method: paymentData.payment_method_id,
        installments: paymentData.installments,
        status: status,
        provider_status: paymentData.status,
        provider_detail: paymentData.status_detail,
        provider_response: JSON.stringify(paymentData),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (paymentError) throw paymentError;
    
    console.log(`Order ${orderId} updated to status ${status}`);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Function to sync with Omie when payment is completed
async function syncWithOmie(supabase: any, orderId: string, paymentData: any) {
  try {
    // Get order details including customer info
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles: user_id (
          id, 
          full_name, 
          email, 
          omie_code,
          omie_sync
        )
      `)
      .eq('id', orderId)
      .single();
    
    if (orderError) throw orderError;
    
    // Check if customer is synced with Omie, if not sync them first
    if (!order.profiles.omie_sync || !order.profiles.omie_code) {
      console.log(`Customer ${order.user_id} not synced with Omie. Syncing first...`);
      
      // Call omie-customer function to sync customer
      const { data: customerData, error: customerError } = await supabase.functions.invoke('omie-customer', {
        body: { user_id: order.user_id }
      });
      
      if (customerError) {
        console.error('Error syncing customer with Omie:', customerError);
        throw customerError;
      }
      
      console.log('Customer sync with Omie result:', customerData);
    }
    
    // Now sync the order with Omie
    const { data: omieData, error: omieError } = await supabase.functions.invoke('sync-omie-order', {
      body: {
        order_id: orderId,
        payment_data: paymentData,
        is_paid: true
      }
    });
    
    if (omieError) {
      console.error('Error syncing order with Omie:', omieError);
      
      // Record sync error but don't fail the process
      await supabase
        .from('orders')
        .update({
          omie_sync_errors: [...(order.omie_sync_errors || []), {
            date: new Date().toISOString(),
            message: omieError.message || 'Unknown error',
            details: JSON.stringify(omieError)
          }],
          omie_last_sync_attempt: new Date().toISOString()
        })
        .eq('id', orderId);
        
      throw omieError;
    }
    
    // Update order with Omie data
    if (omieData?.omie_order_id) {
      await supabase
        .from('orders')
        .update({
          omie_order_id: omieData.omie_order_id,
          omie_status: 'faturado',
          omie_last_update: new Date().toISOString(),
          omie_last_sync_attempt: new Date().toISOString()
        })
        .eq('id', orderId);
    }
    
    console.log(`Order ${orderId} synced with Omie successfully`);
  } catch (error) {
    console.error('Error syncing with Omie:', error);
    throw error;
  }
}
