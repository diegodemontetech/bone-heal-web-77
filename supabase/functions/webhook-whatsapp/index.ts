
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

// Interface para um remetente de mensagem
interface Sender {
  phone: string;
  name: string;
}

// Interface para uma mensagem recebida
interface IncomingMessage {
  leadId: string;
  content: string;
  sender: Sender;
}

// Processa uma mensagem da Evolution API
function processEvolutionMessage(message: any): IncomingMessage | null {
  if (!message || !message.key || !message.key.remoteJid) {
    console.error("Mensagem inválida da Evolution API:", message);
    return null;
  }

  const phone = message.key.remoteJid.split('@')[0];
  const name = message.pushName || 'Desconhecido';
  const content = message.message?.conversation || 
                  message.message?.extendedTextMessage?.text ||
                  '[Mensagem sem texto]';
  
  console.log(`Mensagem de ${name} (${phone}): ${content}`);
  
  return {
    content,
    sender: { phone, name },
    leadId: '' // Será preenchido depois
  };
}

// Processa uma mensagem da Z-API
function processZAPIMessage(body: any): IncomingMessage | null {
  if (!body) {
    console.error("Payload inválido da Z-API");
    return null;
  }

  const phone = (body.phone || body.from || '')
                 .replace(/^(\d+)@.*$/, '$1');
  const content = body.text || body.message || body.body || '[Sem texto]';
  const name = body.name || body.notifyName || 'Desconhecido';
  
  if (!phone || !content) {
    console.error("Dados insuficientes da Z-API:", body);
    return null;
  }
  
  console.log(`Mensagem Z-API de ${name} (${phone}): ${content}`);
  
  return {
    content,
    sender: { phone, name },
    leadId: '' // Será preenchido depois
  };
}

// Verifica ou cria um lead com base no remetente
async function findOrCreateLead(sender: Sender): Promise<string> {
  try {
    // Buscar lead existente
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', sender.phone)
      .single();
    
    if (leadError || !leadData) {
      // Criar novo lead
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
      
      // Criar notificação para novo lead
      await supabase
        .from('notifications')
        .insert({
          type: 'whatsapp_human_needed',
          content: `Novo contato de ${sender.name} (${sender.phone}) precisa de atendimento humano.`,
          status: 'pending'
        });
      
      return newLead.id;
    } 
    
    // Atualizar lead existente
    const { error: updateError } = await supabase
      .from('leads')
      .update({ 
        last_contact: new Date().toISOString(),
        needs_human: true 
      })
      .eq('id', leadData.id);
    
    if (updateError) {
      console.error("Erro ao atualizar lead:", updateError.message);
    }
    
    // Criar notificação apenas se o lead ainda não estiver marcado como precisando de atendimento
    if (!leadData.needs_human) {
      await supabase
        .from('notifications')
        .insert({
          type: 'whatsapp_human_needed',
          content: `${sender.name} (${sender.phone}) precisa de atendimento humano.`,
          status: 'pending'
        });
    }
    
    return leadData.id;
  } catch (error) {
    console.error("Erro ao processar lead:", error.message);
    throw error;
  }
}

// Registra mensagem no banco de dados
async function saveMessage(leadId: string, content: string): Promise<void> {
  try {
    const { error: msgError } = await supabase
      .from('whatsapp_messages')
      .insert({
        lead_id: leadId,
        message: content,
        direction: 'incoming',
        is_bot: false
      });
    
    if (msgError) {
      console.error("Erro ao registrar mensagem:", msgError.message);
      throw msgError;
    }
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    throw error;
  }
}

// Processa o webhook
async function processWebhook(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    console.log("Webhook recebido:", JSON.stringify(body));
    
    let message: IncomingMessage | null = null;
    
    // Determinar o tipo de webhook e extrair a mensagem
    if (body.event === 'messages.upsert' && body.message?.key?.fromMe === false) {
      // Webhook da Evolution API
      message = processEvolutionMessage(body.message);
    } else if (body.phone || body.messageId) {
      // Webhook da Z-API
      message = processZAPIMessage(body);
    }
    
    if (message) {
      // Processar a mensagem recebida
      const leadId = await findOrCreateLead(message.sender);
      message.leadId = leadId;
      
      // Salvar a mensagem no banco
      await saveMessage(leadId, message.content);
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
}

// Handler principal
serve(async (req) => {
  // Tratar solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  return processWebhook(req);
});
