
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Webhook recebido:', body)

    // Se não for uma notificação de pagamento, ignora
    if (body.type !== 'payment') {
      return new Response(JSON.stringify({ message: 'Notificação não relacionada a pagamento' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const access_token = Deno.env.get('MP_ACCESS_TOKEN')
    if (!access_token) {
      throw new Error('Token do Mercado Pago não configurado')
    }

    // Busca os detalhes do pagamento
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${body.data.id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    if (!paymentResponse.ok) {
      throw new Error('Erro ao buscar detalhes do pagamento')
    }

    const paymentData = await paymentResponse.json()
    console.log('Dados do pagamento:', paymentData)

    // Inicializa cliente do Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const orderId = paymentData.external_reference
    const status = paymentData.status

    // Atualiza o status do pagamento
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: status === 'approved' ? 'paid' : status,
        mercadopago_status: status,
        mercadopago_payment_id: paymentData.id,
        mercadopago_payment_type: paymentData.payment_type_id,
        paid_at: status === 'approved' ? new Date().toISOString() : null
      })
      .eq('order_id', orderId)

    if (updateError) {
      throw updateError
    }

    // Se o pagamento foi aprovado, atualiza o pedido e integra com OMIE
    if (status === 'approved') {
      // Busca dados do pedido e cliente
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            *
          )
        `)
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      // Atualiza status do pedido
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_method: paymentData.payment_type_id
        })
        .eq('id', orderId)

      if (orderUpdateError) throw orderUpdateError

      // Integração com OMIE
      if (orderData) {
        try {
          // Primeiro verifica/cadastra cliente no OMIE
          const customerResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/omie-customer`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({
                user_id: orderData.user_id,
                profile: orderData.profiles
              })
            }
          )

          if (!customerResponse.ok) {
            throw new Error('Erro ao processar cliente no OMIE')
          }

          const customerData = await customerResponse.json()
          console.log('Cliente processado no OMIE:', customerData)

          // Depois cria pedido no OMIE
          const omieResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/omie-integration`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({
                action: 'sync_order',
                order_id: orderId,
                payment_data: {
                  method: paymentData.payment_type_id,
                  transaction_id: paymentData.id,
                  paid_amount: paymentData.transaction_amount
                }
              })
            }
          )

          if (!omieResponse.ok) {
            throw new Error('Erro ao sincronizar com OMIE')
          }

          console.log('Pedido sincronizado com OMIE com sucesso')
        } catch (omieError) {
          console.error('Erro na integração com OMIE:', omieError)
          
          // Registra erro na sincronização
          await supabase
            .from('orders')
            .update({
              omie_sync_errors: orderData.omie_sync_errors ? 
                [...orderData.omie_sync_errors, omieError.message] : 
                [omieError.message]
            })
            .eq('id', orderId)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Erro no webhook:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
