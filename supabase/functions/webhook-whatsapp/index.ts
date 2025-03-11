
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'
import { 
  processIncomingMessage, 
  processLead, 
  analyzeMessageWithGemini, 
  checkHumanTransferKeywords,
  sendWhatsAppResponse,
  notifyAdminsAboutHumanNeeded
} from './message-processor.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Configuração do Supabase e API keys
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configurações do Supabase ausentes')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const payload = await req.json()
    
    console.log('Webhook WhatsApp recebido:', payload)
    
    // 1. Processar a mensagem recebida
    const messageData = processIncomingMessage(payload)
    
    // 2. Processar o lead (criar ou atualizar)
    const leadInfo = await processLead(supabase, messageData)
    messageData.leadId = leadInfo.id
    
    // 3. Determinar ação e resposta
    let needsHumanAgent = leadInfo.needsHumanAgent
    let responseMessage = ''
    
    // Se for um novo lead, enviar mensagem de boas-vindas
    if (leadInfo.status === 'novo') {
      responseMessage = `Olá! Sou a Sueli, assistente virtual da Bone Heal. Como posso te ajudar hoje? 😊\n\nPosso te dar informações sobre nossos produtos odontológicos premium, condições especiais e muito mais!`;
    }
    // Se não precisar de atendimento humano, processar a mensagem
    else if (!needsHumanAgent) {
      // Verificar palavras-chave para atendimento humano
      if (checkHumanTransferKeywords(messageData.message)) {
        needsHumanAgent = true
        responseMessage = "Vou transferir você para um atendente humano. Aguarde um momento, por favor."
        
        // Atualizar status do lead
        await supabase
          .from('leads')
          .update({
            status: 'aguardando_atendente',
            needs_human: true
          })
          .eq('id', messageData.leadId)
      } 
      // Processar com Gemini se disponível
      else if (geminiApiKey) {
        const geminiResult = await analyzeMessageWithGemini(geminiApiKey, messageData.message)
        
        if (geminiResult) {
          responseMessage = geminiResult.resposta
          
          // Atualizar classificação e status do lead
          await supabase
            .from('leads')
            .update({
              intention: geminiResult.intencao,
              needs_human: geminiResult.transferir,
              status: geminiResult.transferir ? 'aguardando_atendente' : 'atendido_bot'
            })
            .eq('id', messageData.leadId)
            
          needsHumanAgent = geminiResult.transferir
        } else {
          // Resposta padrão se falhar análise
          responseMessage = "Olá! Recebemos sua mensagem e estamos analisando. Logo entraremos em contato!"
        }
      } else {
        // Resposta genérica se não tiver API Gemini configurada
        responseMessage = "Olá! Obrigado por entrar em contato com a Bone Heal. Um dos nossos especialistas irá atendê-lo em breve."
      }
    }
    
    // 4. Enviar resposta (se não marcado para atendimento humano e tiver resposta)
    if (!needsHumanAgent && responseMessage) {
      const sent = await sendWhatsAppResponse(
        messageData.phone, 
        responseMessage,
        messageData.isEvolutionApi,
        messageData.instance
      )
      
      if (sent) {
        // Registrar mensagem enviada
        await supabase.from('whatsapp_messages').insert({
          lead_id: messageData.leadId,
          message: responseMessage,
          direction: 'outbound',
          sent_by: 'bot'
        })
      }
    }
    
    // 5. Notificar administradores se necessário atendimento humano
    if (needsHumanAgent) {
      await notifyAdminsAboutHumanNeeded(supabase, messageData.leadId, messageData.name, messageData.phone)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao processar webhook WhatsApp:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
