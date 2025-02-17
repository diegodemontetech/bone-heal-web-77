
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import mercadopago from 'npm:mercadopago'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')

    if (!supabaseUrl || !supabaseKey || !mpAccessToken) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const data = await req.json()
    
    console.log('Received Mercado Pago webhook:', data)

    if (data.type === 'payment') {
      mercadopago.configure({
        access_token: mpAccessToken
      })

      const paymentInfo = await mercadopago.payment.findById(data.data.id)
      const payment = paymentInfo.body

      // Atualizar o pagamento no banco de dados
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: payment.status === 'approved' ? 'paid' : payment.status,
          mercadopago_status: payment.status,
          mercadopago_payment_type: payment.payment_type_id,
          paid_at: payment.status === 'approved' ? new Date().toISOString() : null
        })
        .eq('mercadopago_payment_id', payment.id)

      if (updateError) throw updateError

      // Se o pagamento foi aprovado, criar pedido no Omie
      if (payment.status === 'approved') {
        const { data: orderData } = await supabase
          .from('orders')
          .select('*, payments(*)')
          .eq('payments.mercadopago_payment_id', payment.id)
          .single()

        if (orderData) {
          // Criar pedido no Omie
          const { error: omieError } = await supabase.functions.invoke('omie-integration', {
            body: {
              action: 'create_order',
              order: {
                ...orderData,
                payment_confirmed: true,
                payment_method: payment.payment_type_id
              }
            }
          })

          if (omieError) throw omieError
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
