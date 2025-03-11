
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { WhatsAppMessagePayload, LeadInfo, MessageData } from '../_shared/types.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Processa mensagem recebida e extrai informações relevantes
export function processIncomingMessage(payload: WhatsAppMessagePayload): MessageData {
  let phone, message, name, isEvolutionApi = false, instance;
  
  // Detectar formato do Evolution API
  if (payload.data && payload.data.key && payload.data.key.remoteJid) {
    isEvolutionApi = true;
    const jid = payload.data.key.remoteJid;
    phone = jid.split('@')[0];
    instance = payload.instance;
    
    // Extrair mensagem do formato Evolution API
    if (payload.data.message && payload.data.message.conversation) {
      message = payload.data.message.conversation;
    } else if (payload.data.message && payload.data.message.extendedTextMessage) {
      message = payload.data.message.extendedTextMessage.text;
    } else {
      // Pode haver outros formatos como imagem, áudio, etc.
      message = '[Mensagem não textual]';
    }
    
    // Nome pode ser extraído de outras partes do payload
    name = payload.data.pushName || phone;
  } else if (payload.phone) {
    // Formato Z-API
    phone = payload.phone;
    message = payload.body || payload.message || '[Mensagem não textual]';
    name = payload.name || payload.contactName || phone;
  } else {
    throw new Error('Formato de webhook não reconhecido');
  }
  
  // Remover prefixo de país se necessário
  if (phone.startsWith('55')) {
    phone = phone.substring(2);
  }
  
  return {
    leadId: '', // Será preenchido depois
    message,
    phone,
    name,
    isEvolutionApi,
    timestamp: new Date().toISOString(),
    instance
  };
}

// Processa o lead (cria novo ou atualiza existente)
export async function processLead(
  supabase: ReturnType<typeof createClient>,
  messageData: MessageData
): Promise<LeadInfo> {
  // Verificar se o lead já existe
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id, status, name')
    .eq('phone', messageData.phone)
    .maybeSingle();
  
  let leadId;
  let needsHumanAgent = false;
  
  if (existingLead) {
    // Atualiza lead existente
    leadId = existingLead.id;
    
    // Verificar se o lead já está em atendimento humano
    if (existingLead.status === 'atendido_humano') {
      needsHumanAgent = true;
    } else {
      // Atualizar status para 'aguardando'
      await supabase
        .from('leads')
        .update({
          last_contact: messageData.timestamp,
          status: 'aguardando',
        })
        .eq('id', leadId);
    }
  } else {
    // Cria novo lead
    const { data: newLead } = await supabase
      .from('leads')
      .insert({
        phone: messageData.phone, 
        name: messageData.name || messageData.phone, 
        last_contact: messageData.timestamp,
        source: 'whatsapp_webhook',
        status: 'novo'
      })
      .select()
      .single();
    
    leadId = newLead.id;
  }
  
  // Registrar mensagem recebida
  await supabase.from('whatsapp_messages').insert({
    lead_id: leadId,
    message: messageData.message,
    direction: 'inbound',
    sent_by: 'cliente'
  });

  return {
    id: leadId,
    status: existingLead?.status || 'novo',
    name: messageData.name,
    needsHumanAgent
  };
}

// Analisa a mensagem usando Gemini API
export async function analyzeMessageWithGemini(
  geminiApiKey: string,
  message: string
): Promise<{ resposta: string; intencao: string; transferir: boolean } | null> {
  try {
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é Sueli, assistente virtual premium especializada em atendimento para dentistas e profissionais odontológicos. 
            Você valoriza a cordialidade e oferece informações precisas sobre produtos odontológicos premium da Bone Heal. 
            Responda de forma rápida, amigável e técnica.
            
            Analise a seguinte mensagem do cliente: "${message}"
            
            Forneça:
            1. Uma resposta curta, cordial e profissional (máximo 3 parágrafos)
            2. Classifique a intenção do cliente como: Curiosidade, Intenção de Compra, Orçamento ou Dúvida Técnica
            3. Indique se o cliente deve ser transferido para um atendente humano (true/false)
            
            Formato da resposta:
            {
              "resposta": "Sua resposta aqui",
              "intencao": "Curiosidade/Intenção de Compra/Orçamento/Dúvida Técnica",
              "transferir": true/false
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      })
    });
    
    const geminiData = await geminiResponse.json();
    
    if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content) {
      const textContent = geminiData.candidates[0].content.parts[0].text;
      
      try {
        // Extrair o JSON da resposta
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Erro ao processar resposta do Gemini:', parseError);
      }
    }
  } catch (aiError) {
    console.error('Erro ao consultar Gemini API:', aiError);
  }
  
  return null;
}

// Verifica se a mensagem contém palavras-chave para transferência humana
export function checkHumanTransferKeywords(message: string): boolean {
  const humanKeywords = ['humano', 'pessoa', 'atendente', 'falar com gente', 'falar com pessoa', 'pessoa real'];
  return humanKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// Envia mensagem de resposta via API selecionada
export async function sendWhatsAppResponse(
  phone: string,
  message: string,
  isEvolutionApi: boolean,
  instance?: string
): Promise<boolean> {
  try {
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const zApiInstanceId = Deno.env.get('ZAPI_INSTANCE_ID');
    const zApiToken = Deno.env.get('ZAPI_TOKEN');
    
    // Escolha a API apropriada para enviar a resposta
    if (evolutionApiUrl && evolutionApiKey) {
      // Usar a mesma instância que recebeu a mensagem, se disponível
      const instanceId = isEvolutionApi && instance ? instance : 'default';
      
      // Enviar mensagem pela Evolution API
      const response = await fetch(`${evolutionApiUrl}/message/sendText/${instanceId}`, {
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
      
      return response.ok;
    } else if (zApiInstanceId && zApiToken) {
      // Fallback para Z-API
      const response = await fetch(`https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          message,
        }),
      });
      
      return response.ok;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    return false;
  }
}

// Notifica os administradores sobre necessidade de atendimento humano
export async function notifyAdminsAboutHumanNeeded(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  name: string,
  phone: string
): Promise<void> {
  await supabase.from('notifications').insert({
    type: 'whatsapp_human_needed',
    lead_id: leadId,
    message: `Cliente ${name || phone} precisa de atendimento humano via WhatsApp`,
    status: 'pending'
  });
}
