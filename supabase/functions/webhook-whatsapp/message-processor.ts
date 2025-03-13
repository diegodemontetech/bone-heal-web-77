
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { WhatsAppMessagePayload, LeadInfo, MessageData } from '../_shared/types.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { processIncomingMessage, checkHumanTransferKeywords } from './message-extractor.ts';
import { processLead, updateLeadForHumanAttendance } from './lead-processor.ts';
import { analyzeMessageWithGemini } from './message-analyzer.ts';
import { sendWhatsAppResponse, registerResponseMessage } from './message-sender.ts';
import { notifyAdminsAboutHumanNeeded } from './notification-service.ts';

// Re-exportar todas as funções necessárias para manter compatibilidade com o código existente
export {
  processIncomingMessage,
  processLead,
  analyzeMessageWithGemini,
  checkHumanTransferKeywords,
  sendWhatsAppResponse,
  notifyAdminsAboutHumanNeeded
};

// Adicionando uma função que coordena todo o fluxo de processamento de mensagens
export async function handleIncomingMessage(
  supabase: ReturnType<typeof createClient>,
  payload: WhatsAppMessagePayload
): Promise<{ success: boolean; message: string; needsHuman?: boolean }> {
  try {
    // Extrair dados da mensagem recebida
    const messageData = processIncomingMessage(payload);
    console.log("Mensagem processada:", JSON.stringify(messageData));
    
    // Processar o lead e obter informações
    const leadInfo = await processLead(supabase, messageData);
    messageData.leadId = leadInfo.id;
    
    // Verificar se o lead já está em atendimento humano
    if (leadInfo.needsHumanAgent) {
      console.log(`Lead ${leadInfo.id} já está em atendimento humano. Criando apenas notificação.`);
      await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
      return {
        success: true,
        message: 'Mensagem encaminhada para atendente humano',
        needsHuman: true
      };
    }
    
    // Verificar se a mensagem contém palavras-chave que indicam necessidade de atendimento humano
    if (checkHumanTransferKeywords(messageData.message)) {
      console.log(`Palavras-chave de atendimento humano detectadas na mensagem`);
      
      // Atualizar status do lead
      await updateLeadForHumanAttendance(supabase, leadInfo.id);
      
      // Notificar administradores
      await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
      
      // Enviar mensagem informando que um atendente humano irá responder
      const autoResponse = "Olá! Entendi que você deseja falar com um de nossos atendentes. Um profissional irá atendê-lo o mais breve possível. Agradecemos sua paciência.";
      await sendWhatsAppResponse(messageData.phone, autoResponse, messageData.isEvolutionApi, messageData.instance);
      await registerResponseMessage(supabase, leadInfo.id, autoResponse);
      
      return {
        success: true,
        message: 'Mensagem encaminhada para atendente humano',
        needsHuman: true
      };
    }
    
    // Tentar analisar a mensagem com IA
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (geminiApiKey) {
      try {
        const aiAnalysis = await analyzeMessageWithGemini(geminiApiKey, messageData.message);
        
        if (aiAnalysis) {
          console.log("Análise da IA:", JSON.stringify(aiAnalysis));
          
          // Registrar resposta da IA no banco
          await registerResponseMessage(supabase, leadInfo.id, aiAnalysis.resposta);
          
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
            await updateLeadForHumanAttendance(supabase, leadInfo.id);
            
            // Notificar administradores
            await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
            
            return {
              success: true,
              message: 'Mensagem respondida pela IA e encaminhada para atendente humano',
              needsHuman: true
            };
          }
          
          return {
            success: true,
            message: 'Mensagem respondida pela IA'
          };
        }
      } catch (aiError) {
        console.error("Erro ao processar resposta com IA:", aiError);
      }
    }
    
    // Fallback se a IA não estiver disponível ou falhar
    console.log("Usando resposta automática padrão");
    const defaultResponse = "Olá! Recebemos sua mensagem e um de nossos atendentes irá responder em breve. Agradecemos seu contato!";
    
    // Registrar resposta automática no banco
    await registerResponseMessage(supabase, leadInfo.id, defaultResponse);
    
    // Enviar resposta automática
    await sendWhatsAppResponse(
      messageData.phone, 
      defaultResponse, 
      messageData.isEvolutionApi,
      messageData.instance
    );
    
    // Marcar lead para atendimento humano
    await updateLeadForHumanAttendance(supabase, leadInfo.id);
    
    // Notificar administradores
    await notifyAdminsAboutHumanNeeded(supabase, leadInfo.id, leadInfo.name, messageData.phone);
    
    return {
      success: true,
      message: 'Resposta automática enviada',
      needsHuman: true
    };
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    return {
      success: false,
      message: `Erro ao processar mensagem: ${error.message}`
    };
  }
}
