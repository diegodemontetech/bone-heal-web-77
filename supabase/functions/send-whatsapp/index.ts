
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const zApiInstanceId = Deno.env.get('ZAPI_INSTANCE_ID')
    const zApiToken = Deno.env.get('ZAPI_TOKEN')
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL')
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configurações do Supabase ausentes')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { phone, message, name, isAgent, agentId, orderId } = await req.json()

    console.log('Enviando mensagem WhatsApp:', { phone, message, name, isAgent, agentId, orderId })

    let response;
    
    // Verificar qual API usar para envio
    if (evolutionApiUrl && evolutionApiKey) {
      // Usar Evolution API
      response = await fetch(`${evolutionApiUrl}/message/sendText/${agentId || 'default'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify({
          number: phone,
          options: {
            delay: 1200,
            presence: "composing"
          },
          textMessage: {
            text: message
          }
        }),
      });
    } else if (zApiInstanceId && zApiToken) {
      // Fallback para Z-API
      response = await fetch(`https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          message,
        }),
      });
    } else {
      throw new Error('Nenhuma API de WhatsApp configurada')
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API de WhatsApp: ${response.statusText}. Detalhes: ${errorText}`);
    }

    const result = await response.json()

    // Registrar interação no banco de dados
    if (name) {
      const timestamp = new Date().toISOString();
      
      // Verificar se o lead já existe
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();
      
      if (existingLead) {
        // Atualiza lead existente
        await supabase
          .from('leads')
          .update({
            last_contact: timestamp,
            status: isAgent ? 'atendido_humano' : 'atendido_bot',
            name: name // Atualiza o nome caso tenha mudado
          })
          .eq('phone', phone);
          
        // Adiciona mensagem ao histórico
        await supabase.from('whatsapp_messages').insert({
          lead_id: existingLead.id,
          message,
          direction: 'outbound',
          sent_by: isAgent ? 'agente' : 'bot',
          agent_id: agentId,
          order_id: orderId
        });
      } else {
        // Cria novo lead e registra mensagem
        const { data: newLead } = await supabase
          .from('leads')
          .insert({
            phone, 
            name, 
            last_contact: timestamp,
            source: 'whatsapp_widget',
            status: isAgent ? 'atendido_humano' : 'atendido_bot'
          })
          .select()
          .single();
          
        if (newLead) {
          await supabase.from('whatsapp_messages').insert({
            lead_id: newLead.id,
            message,
            direction: 'outbound',
            sent_by: isAgent ? 'agente' : 'bot',
            agent_id: agentId,
            order_id: orderId
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
