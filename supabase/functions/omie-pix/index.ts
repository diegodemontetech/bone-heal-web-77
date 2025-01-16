import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action, order_id } = await req.json()

    switch (action) {
      case 'generate_pix': {
        // Get order details from database
        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', order_id)
          .single()

        if (orderError) throw orderError

        // Generate PIX via Omie CASH API
        const omieResponse = await fetch('https://app.omie.com.br/api/v1/financas/pixcash/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            call: 'GerarCobrancaPix',
            app_key: Deno.env.get('OMIE_APP_KEY'),
            app_secret: Deno.env.get('OMIE_APP_SECRET'),
            param: [{
              codigo_pedido: order.omie_order_id,
              valor_total: order.total_amount,
            }],
          }),
        })

        const omieData = await omieResponse.json()

        // Save PIX info in payments table
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            order_id: order_id,
            payment_method: 'pix',
            status: 'pending',
            amount: order.total_amount,
            pix_code: omieData.codigo_pix,
          })

        if (paymentError) throw paymentError

        return new Response(
          JSON.stringify({ 
            success: true, 
            pix_code: omieData.codigo_pix,
            qr_code: omieData.qrcode_url 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'check_payment': {
        // Get payment details
        const { data: payment, error: paymentError } = await supabaseClient
          .from('payments')
          .select('*, orders(*)')
          .eq('order_id', order_id)
          .single()

        if (paymentError) throw paymentError

        // Check payment status in Omie
        const omieResponse = await fetch('https://app.omie.com.br/api/v1/financas/pixcash/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            call: 'ConsultarStatusPix',
            app_key: Deno.env.get('OMIE_APP_KEY'),
            app_secret: Deno.env.get('OMIE_APP_SECRET'),
            param: [{
              codigo_pedido: payment.orders.omie_order_id,
            }],
          }),
        })

        const omieData = await omieResponse.json()

        if (omieData.status === 'CONCLUIDA') {
          // Update payment status
          const { error: updatePaymentError } = await supabaseClient
            .from('payments')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
            })
            .eq('id', payment.id)

          if (updatePaymentError) throw updatePaymentError

          // Update order status
          const { error: updateOrderError } = await supabaseClient
            .from('orders')
            .update({
              status: 'paid',
              omie_status: 'pago',
            })
            .eq('id', order_id)

          if (updateOrderError) throw updateOrderError
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            status: omieData.status 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})