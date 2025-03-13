
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  processIncomingMessage, 
  processLead, 
  analyzeMessageWithGemini, 
  checkHumanTransferKeywords,
  sendWhatsAppResponse,
  notifyAdminsAboutHumanNeeded
} from "./message-processor.ts";

// Inicializar cliente Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Processa o webhook
async function processWebhook(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    console.log("Webhook recebido:", JSON.stringify(body));
    
    try {
      // Extrair dados da mensagem recebida
      const messageData = processIncomingMessage(body);
      console.log("Mensagem processada:", JSON.stringify(messageData));
      
      // Processar o lead e obter informações
      const leadInfo = await processLead(supabase, messageData);
      messageData.leadId = leadInfo.id;
      
      // Verificar se o lead já está em atendimento humano
      if (leadInfo.needsHumanAgent) {
        console.log(`Lead ${leadInfo.id} já está em atendimento humano. Criando apenas notificação.`);
        await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
        return new Response(
          JSON.stringify({ success: true, message: 'Mensagem encaminhada para atendente humano' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Verificar se a mensagem contém palavras-chave que indicam necessidade de atendimento humano
      if (checkHumanTransferKeywords(messageData.message)) {
        console.log(`Palavras-chave de atendimento humano detectadas na mensagem`);
        
        // Atualizar status do lead
        await supabase
          .from('leads')
          .update({ 
            needs_human: true,
            status: 'atendido_humano'
          })
          .eq('id', leadInfo.id);
        
        // Notificar administradores
        await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
        
        // Enviar mensagem informando que um atendente humano irá responder
        const autoResponse = "Olá! Entendi que você deseja falar com um de nossos atendentes. Um profissional irá atendê-lo o mais breve possível. Agradecemos sua paciência.";
        await sendWhatsAppResponse(messageData.phone, autoResponse, messageData.isEvolutionApi, messageData.instance);
        
        return new Response(
          JSON.stringify({ success: true, message: 'Mensagem encaminhada para atendente humano' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Tentar analisar a mensagem com IA
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (geminiApiKey) {
        try {
          const aiAnalysis = await analyzeMessageWithGemini(geminiApiKey, messageData.message);
          
          if (aiAnalysis) {
            console.log("Análise da IA:", JSON.stringify(aiAnalysis));
            
            // Registrar resposta da IA no banco
            await supabase.from('whatsapp_messages').insert({
              lead_id: leadInfo.id,
              message: aiAnalysis.resposta,
              direction: 'outbound',
              sent_by: 'bot'
            });
            
            // Enviar resposta
            await sendWhatsAppResponse(
              messageData.phone, 
              aiAnalysis.resposta, 
              messageData.isEvolutionApi,
              messageData.instance
            );
            
            // Se a IA indicar transferência para humano
            if (aiAnalysis.transferir) {
              // Atualizar status do lead
              await supabase
                .from('leads')
                .update({ 
                  needs_human: true,
                  status: 'atendido_humano'
                })
                .eq('id', leadInfo.id);
              
              // Notificar administradores
              await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
            }
            
            return new Response(
              JSON.stringify({ success: true, message: 'Mensagem respondida pela IA' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } catch (aiError) {
          console.error("Erro ao processar resposta com IA:", aiError);
        }
      }
      
      // Fallback se a IA não estiver disponível ou falhar
      console.log("Usando resposta automática padrão");
      const defaultResponse = "Olá! Recebemos sua mensagem e um de nossos atendentes irá responder em breve. Agradecemos seu contato!";
      
      // Registrar resposta automática no banco
      await supabase.from('whatsapp_messages').insert({
        lead_id: leadInfo.id,
        message: defaultResponse,
        direction: 'outbound',
        sent_by: 'bot'
      });
      
      // Enviar resposta automática
      await sendWhatsAppResponse(
        messageData.phone, 
        defaultResponse, 
        messageData.isEvolutionApi,
        messageData.instance
      );
      
      // Marcar lead para atendimento humano
      await supabase
        .from('leads')
        .update({ needs_human: true })
        .eq('id', leadInfo.id);
      
      // Notificar administradores
      await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Resposta automática enviada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (processingError) {
      console.error("Erro ao processar mensagem:", processingError);
      return new Response(
        JSON.stringify({ success: false, error: `Erro ao processar mensagem: ${processingError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
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
