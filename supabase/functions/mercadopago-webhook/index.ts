
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Faltam credenciais do Supabase')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Configurar token do Mercado Pago
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error('Token do Mercado Pago não configurado')
    }

    // Obter dados da requisição
    const formData = await req.formData()
    const idStr = formData.get('id')
    const topicStr = formData.get('topic')

    if (!idStr || !topicStr) {
      throw new Error('Webhook inválido: faltam id ou topic')
    }

    const id = String(idStr)
    const topic = String(topicStr)

    console.log(`Webhook recebido: topic=${topic}, id=${id}`)

    // Verificar se é uma notificação de pagamento
    if (topic !== 'payment') {
      return new Response(
        JSON.stringify({ message: `Ignorando evento: ${topic}` }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Buscar informações do pagamento no Mercado Pago
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${mpAccessToken}`
        }
      }
    )

    if (!mpResponse.ok) {
      throw new Error(`Erro ao buscar pagamento: ${mpResponse.status}`)
    }

    const paymentData = await mpResponse.json()
    console.log('Dados do pagamento:', JSON.stringify(paymentData, null, 2))

    // Verificar a referência externa (order_id)
    const orderId = paymentData.external_reference
    
    if (!orderId) {
      throw new Error('Referência externa não encontrada no pagamento')
    }

    // Buscar o pedido no banco de dados
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError) {
      throw new Error(`Pedido não encontrado: ${orderError.message}`)
    }

    // Mapear status do MP para status do pedido
    let orderStatus = 'pending'
    let paymentStatus = 'pending'
    
    switch (paymentData.status) {
      case 'approved':
        orderStatus = 'processing'
        paymentStatus = 'completed'
        break
      case 'rejected':
      case 'cancelled':
        paymentStatus = 'failed'
        break
      case 'in_process':
      case 'pending':
        paymentStatus = 'pending'
        break
    }

    // Atualizar o status do pedido
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: orderStatus,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      throw new Error(`Erro ao atualizar pedido: ${updateError.message}`)
    }

    // Registrar o pagamento
    const { error: paymentError } = await supabase
      .from('payments')
      .upsert([{
        order_id: orderId,
        payment_id: id,
        provider: 'mercadopago',
        amount: paymentData.transaction_amount,
        status: paymentStatus,
        payment_method: paymentData.payment_method_id,
        payment_details: paymentData,
        created_at: new Date().toISOString()
      }])

    if (paymentError) {
      throw new Error(`Erro ao registrar pagamento: ${paymentError.message}`)
    }

    // Criar notificação para o usuário
    await supabase
      .from('notifications')
      .insert({
        user_id: orderData.user_id,
        title: 'Atualização de pagamento',
        message: paymentStatus === 'completed' 
          ? 'Seu pagamento foi aprovado!' 
          : paymentStatus === 'failed'
            ? 'Houve um problema com seu pagamento'
            : 'Seu pagamento está sendo processado',
        type: 'payment',
        read: false,
        link: `/orders/${orderId}`
      })

    // Se o pagamento for aprovado, disparar workflow do n8n
    if (paymentStatus === 'completed') {
      try {
        // Buscar dados do cliente
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', orderData.user_id)
          .single()

        if (userData) {
          // Disparar webhook do n8n
          const n8nWebhookBase = Deno.env.get('N8N_WEBHOOK_BASE_URL')
          
          if (n8nWebhookBase) {
            const n8nWebhookUrl = `${n8nWebhookBase}/pedido_pago`
            
            await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                order_id: orderId,
                customer_name: userData.full_name,
                customer_email: userData.email,
                customer_phone: userData.phone,
                total: orderData.total_amount,
                payment_method: paymentData.payment_method_id,
                payment_status: paymentStatus
              }),
            })
          }
        }
      } catch (n8nError) {
        console.error('Erro ao disparar workflow n8n:', n8nError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Pagamento processado com sucesso' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
})
