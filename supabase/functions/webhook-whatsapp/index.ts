
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inicializar cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Tratar solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Processar o webhook
    const body = await req.json();
    console.log("Webhook recebido:", JSON.stringify(body));

    // Processar mensagem recebida do Evolution API
    if (body.event === 'messages.upsert' && body.message?.key?.fromMe === false) {
      const message = body.message;
      const msgContent = message.message?.conversation || 
                         message.message?.extendedTextMessage?.text ||
                         '[Mensagem sem texto]';
      
      // Obter informações do remetente
      const sender = {
        phone: message.key.remoteJid.split('@')[0],
        name: message.pushName || 'Desconhecido'
      };
      
      console.log(`Mensagem de ${sender.name} (${sender.phone}): ${msgContent}`);
      
      // Verificar se o contato/lead já existe
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', sender.phone)
        .single();
      
      let lead;
      
      // Se o lead não existir, criar um novo
      if (leadError || !leadData) {
        const { data: newLead, error: createError } = await supabase
          .from('leads')
          .insert({
            name: sender.name,
            phone: sender.phone,
            status: 'novo',
            source: 'whatsapp',
            needs_human: true,
            last_contact: new Date().toISOString()
          })
          .select()
          .single();
        
        if (createError) {
          console.error("Erro ao criar lead:", createError.message);
          throw createError;
        }
        
        lead = newLead;
        console.log("Novo lead criado:", lead.id);
        
        // Criar notificação para novo lead
        await supabase
          .from('notifications')
          .insert({
            type: 'whatsapp_human_needed',
            content: `Novo contato de ${sender.name} (${sender.phone}) precisa de atendimento humano.`,
            status: 'pending'
          });
      } else {
        lead = leadData;
        console.log("Lead existente encontrado:", lead.id);
        
        // Atualizar timestamp de último contato e marcar como precisando de atendimento humano
        const { error: updateError } = await supabase
          .from('leads')
          .update({ 
            last_contact: new Date().toISOString(),
            needs_human: true 
          })
          .eq('id', lead.id);
        
        if (updateError) {
          console.error("Erro ao atualizar lead:", updateError.message);
        }
        
        // Criar notificação apenas se o lead ainda não estiver marcado como precisando de atendimento
        if (!lead.needs_human) {
          await supabase
            .from('notifications')
            .insert({
              type: 'whatsapp_human_needed',
              content: `${sender.name} (${sender.phone}) precisa de atendimento humano.`,
              status: 'pending'
            });
        }
      }
      
      // Registrar a mensagem no banco de dados
      const { error: msgError } = await supabase
        .from('whatsapp_messages')
        .insert({
          lead_id: lead.id,
          message: msgContent,
          direction: 'incoming',
          is_bot: false
        });
      
      if (msgError) {
        console.error("Erro ao registrar mensagem:", msgError.message);
      }
      
      // TODO: Implementar integração com IA para atendimento automatizado
      // Por enquanto, apenas aguardar atendimento humano
    }
    
    // Processar webhook da Z-API como alternativa
    else if (body.phone || body.messageId) {
      const phone = body.phone || body.from || '';
      const message = body.text || body.message || body.body || '[Sem texto]';
      const senderName = body.name || body.notifyName || 'Desconhecido';
      
      // Remover prefixo/sufixo do número se necessário (Z-API envia com prefixo)
      const cleanPhone = phone.replace(/^(\d+)@.*$/, '$1');
      
      if (cleanPhone && message) {
        console.log(`Mensagem Z-API de ${senderName} (${cleanPhone}): ${message}`);
        
        // Verificar se o contato/lead já existe
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select('*')
          .eq('phone', cleanPhone)
          .single();
        
        let lead;
        
        // Se o lead não existir, criar um novo
        if (leadError || !leadData) {
          const { data: newLead, error: createError } = await supabase
            .from('leads')
            .insert({
              name: senderName,
              phone: cleanPhone,
              status: 'novo',
              source: 'whatsapp',
              needs_human: true,
              last_contact: new Date().toISOString()
            })
            .select()
            .single();
          
          if (createError) {
            console.error("Erro ao criar lead:", createError.message);
            throw createError;
          }
          
          lead = newLead;
          
          // Criar notificação para novo lead
          await supabase
            .from('notifications')
            .insert({
              type: 'whatsapp_human_needed',
              content: `Novo contato de ${senderName} (${cleanPhone}) precisa de atendimento humano.`,
              status: 'pending'
            });
        } else {
          lead = leadData;
          
          // Atualizar timestamp de último contato e marcar como precisando de atendimento humano
          const { error: updateError } = await supabase
            .from('leads')
            .update({ 
              last_contact: new Date().toISOString(),
              needs_human: true 
            })
            .eq('id', lead.id);
          
          if (updateError) {
            console.error("Erro ao atualizar lead:", updateError.message);
          }
          
          // Criar notificação apenas se o lead ainda não estiver marcado como precisando de atendimento
          if (!lead.needs_human) {
            await supabase
              .from('notifications')
              .insert({
                type: 'whatsapp_human_needed',
                content: `${senderName} (${cleanPhone}) precisa de atendimento humano.`,
                status: 'pending'
              });
          }
        }
        
        // Registrar a mensagem no banco de dados
        const { error: msgError } = await supabase
          .from('whatsapp_messages')
          .insert({
            lead_id: lead.id,
            message: message,
            direction: 'incoming',
            is_bot: false
          });
        
        if (msgError) {
          console.error("Erro ao registrar mensagem:", msgError.message);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processado com sucesso' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro no webhook:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
