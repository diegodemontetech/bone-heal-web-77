
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratamento de requisições OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Webhook recebido do MercadoPago:', JSON.stringify(body, null, 2))

    // Se não for uma notificação de pagamento, registra e responde com sucesso
    if (body.type !== 'payment') {
      console.log(`Notificação de tipo diferente recebida: ${body.type}`)
      return new Response(JSON.stringify({ message: 'Notificação não relacionada a pagamento processada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Verifica se o ID de pagamento está presente
    if (!body.data || !body.data.id) {
      throw new Error('ID de pagamento não encontrado na notificação')
    }

    const paymentId = body.data.id
    console.log(`Processando notificação de pagamento ID: ${paymentId}`)

    const access_token = Deno.env.get('MP_ACCESS_TOKEN')
    if (!access_token) {
      throw new Error('Token do Mercado Pago não configurado no ambiente')
    }

    // Busca os detalhes do pagamento na API do MercadoPago
    console.log(`Buscando detalhes do pagamento: ${paymentId}`)
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text()
      console.error(`Erro ao buscar pagamento ${paymentId}: Status ${paymentResponse.status}`, errorText)
      throw new Error(`Erro ao buscar detalhes do pagamento: ${paymentResponse.status} ${errorText}`)
    }

    const paymentData = await paymentResponse.json()
    console.log('Dados do pagamento recebidos:', JSON.stringify(paymentData, null, 2))

    // Verifica se há referência externa (order_id)
    if (!paymentData.external_reference) {
      throw new Error('Referência externa do pedido não encontrada no pagamento')
    }

    // Inicializa cliente do Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Credenciais do Supabase não configuradas no ambiente')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const orderId = paymentData.external_reference
    const status = paymentData.status

    console.log(`Atualizando pagamento para pedido ${orderId} com status: ${status}`)

    // Atualiza o status do pagamento na tabela payments
    const { data: paymentRecord, error: paymentQueryError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle()

    if (paymentQueryError) {
      throw new Error(`Erro ao buscar registro de pagamento: ${paymentQueryError.message}`)
    }

    if (!paymentRecord) {
      console.warn(`Pagamento não encontrado para o pedido ${orderId}, criando novo registro`)
      
      // Busca informações do pedido para obter o user_id
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('user_id, total_amount')
        .eq('id', orderId)
        .single()
        
      if (orderError) {
        throw new Error(`Erro ao buscar dados do pedido: ${orderError.message}`)
      }
      
      // Cria um novo registro de pagamento
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          user_id: orderData.user_id,
          amount: orderData.total_amount || paymentData.transaction_amount,
          status: status === 'approved' ? 'paid' : status,
          payment_method: 'mercadopago',
          mercadopago_status: status,
          mercadopago_payment_id: paymentData.id,
          mercadopago_payment_type: paymentData.payment_type_id,
          paid_at: status === 'approved' ? new Date().toISOString() : null
        })
        
      if (insertError) {
        throw new Error(`Erro ao criar registro de pagamento: ${insertError.message}`)
      }
      
      console.log(`Novo registro de pagamento criado para o pedido ${orderId}`)
    } else {
      // Atualiza o registro de pagamento existente
      console.log(`Atualizando registro de pagamento existente ID: ${paymentRecord.id}`)
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
        throw new Error(`Erro ao atualizar pagamento: ${updateError.message}`)
      }
    }

    // Se o pagamento foi aprovado, atualiza o pedido e integra com OMIE
    if (status === 'approved') {
      console.log(`Pagamento aprovado para o pedido ${orderId}, atualizando status do pedido`)
      
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

      if (orderError) {
        throw new Error(`Erro ao buscar detalhes do pedido: ${orderError.message}`)
      }

      // Atualiza status do pedido
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_method: paymentData.payment_type_id
        })
        .eq('id', orderId)

      if (orderUpdateError) {
        throw new Error(`Erro ao atualizar status do pedido: ${orderUpdateError.message}`)
      }

      console.log(`Status do pedido ${orderId} atualizado para 'paid'`)

      // Integração com OMIE
      if (orderData) {
        try {
          console.log(`Iniciando integração com OMIE para o pedido ${orderId}`)
          
          // Primeiro verifica/cadastra cliente no OMIE
          console.log('Enviando dados do cliente para o OMIE')
          const customerResponse = await fetch(
            `${supabaseUrl}/functions/v1/omie-customer`,
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
            const errorText = await customerResponse.text()
            throw new Error(`Erro ao processar cliente no OMIE: ${customerResponse.status} ${errorText}`)
          }

          const customerData = await customerResponse.json()
          console.log('Cliente processado no OMIE:', customerData)

          // Depois cria pedido no OMIE
          console.log('Enviando pedido para o OMIE')
          const omieResponse = await fetch(
            `${supabaseUrl}/functions/v1/omie-integration`,
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
            const errorText = await omieResponse.text()
            throw new Error(`Erro ao sincronizar com OMIE: ${omieResponse.status} ${errorText}`)
          }

          console.log('Pedido sincronizado com OMIE com sucesso')
          
          // Envia email de confirmação para o cliente
          try {
            console.log('Enviando email de confirmação de pagamento')
            await fetch(
              `${supabaseUrl}/functions/v1/send-email`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                },
                body: JSON.stringify({
                  template: 'payment_confirmation',
                  to: orderData.profiles.email,
                  data: {
                    customer_name: orderData.profiles.full_name,
                    order_id: orderId.substring(0, 8),
                    order_date: new Date().toLocaleDateString('pt-BR'),
                    order_total: paymentData.transaction_amount.toFixed(2)
                  }
                })
              }
            )
            console.log('Email de confirmação enviado com sucesso')
          } catch (emailError) {
            console.error('Erro ao enviar email de confirmação:', emailError)
            // Não interrompe o fluxo se o email falhar
          }
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
    } else {
      console.log(`Pagamento com status ${status} para o pedido ${orderId}, nenhuma ação adicional necessária`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notificação processada para pagamento ${paymentId}`,
        order_id: orderId,
        payment_status: status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Erro no webhook do MercadoPago:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
