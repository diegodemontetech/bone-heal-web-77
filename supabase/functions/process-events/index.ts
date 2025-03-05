
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not set')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { event, record } = await req.json()

    console.log(`Processing event: ${event}`, record)

    // Processar evento de novo usuário
    if (event === 'new_user') {
      // Sincronizar com Omie
      try {
        await syncUserWithOmie(supabase, record.id)
      } catch (error) {
        console.error('Error syncing user with Omie:', error)
      }

      // Enviar email de boas-vindas
      try {
        await sendWelcomeEmail(supabase, record)
      } catch (error) {
        console.error('Error sending welcome email:', error)
      }
    }
    
    // Processar evento de novo pedido
    if (event === 'new_order') {
      try {
        await notifyNewOrder(supabase, record)
      } catch (error) {
        console.error('Error processing new order:', error)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing event:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Função para sincronizar usuário com Omie
async function syncUserWithOmie(supabase, userId) {
  console.log(`Sincronizando usuário ${userId} com Omie`)
  
  // Buscar dados do perfil
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  
  // Chamar edge function para sincronizar com Omie
  const response = await fetch(
    `${Deno.env.get('SUPABASE_URL')}/functions/v1/omie-customer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ user_id: userId, profile })
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Falha ao sincronizar com Omie: ${error.message || response.statusText}`)
  }
  
  return await response.json()
}

// Função para enviar email de boas-vindas
async function sendWelcomeEmail(supabase, user) {
  // Buscar template de email de boas-vindas
  const { data: template, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('event_type', 'welcome')
    .eq('active', true)
    .single()
  
  if (error) {
    console.log('Template de email de boas-vindas não encontrado')
    return
  }
  
  // Enviar email
  return fetch(
    `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        to: user.email,
        subject: 'Bem-vindo à Bone Heal',
        template_id: template.id,
        variables: {
          name: user.user_metadata?.full_name || user.email
        }
      })
    }
  )
}

// Função para notificar sobre novo pedido
async function notifyNewOrder(supabase, order) {
  // Buscar dados completos do pedido
  const { data: orderData, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        *
      ),
      payments (*)
    `)
    .eq('id', order.id)
    .single()
  
  if (error) throw error
  
  // Buscar emails de administradores
  const { data: admins, error: adminError } = await supabase
    .from('profiles')
    .select('email')
    .eq('is_admin', true)
  
  if (adminError) throw adminError
  
  if (!admins.length) {
    console.log('Nenhum administrador encontrado para notificar')
    return
  }
  
  // Buscar template de email
  const { data: template, error: templateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('event_type', 'new_order')
    .eq('active', true)
    .single()
  
  if (templateError) {
    console.log('Template de email para novo pedido não encontrado')
    return
  }
  
  // Enviar notificações para os administradores
  const notifications = admins.map(admin => {
    return fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          to: admin.email,
          subject: `Novo pedido recebido: #${orderData.id.substring(0, 8)}`,
          template_id: template.id,
          variables: {
            order_id: orderData.id,
            customer_name: orderData.profiles?.full_name || 'Cliente',
            order_total: orderData.total_amount,
            order_date: new Date(orderData.created_at).toLocaleDateString('pt-BR')
          }
        })
      }
    )
  })
  
  await Promise.all(notifications)
}
