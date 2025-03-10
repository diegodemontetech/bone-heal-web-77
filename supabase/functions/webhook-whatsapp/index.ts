
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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configurações do Supabase ausentes')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const payload = await req.json()
    
    console.log('Webhook WhatsApp recebido:', payload)
    
    // Verificar tipo de payload (Evolution API vs Z-API)
    let phone, message, name, isEvolutionApi = false;
    
    // Detectar formato do Evolution API
    if (payload.data && payload.data.key && payload.data.key.remoteJid) {
      isEvolutionApi = true;
      const jid = payload.data.key.remoteJid;
      phone = jid.split('@')[0];
      
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
    
    const timestamp = new Date().toISOString();
    
    // Verificar se o lead já existe
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, status, name')
      .eq('phone', phone)
      .maybeSingle();
    
    let leadId;
    let needsHumanAgent = false;
    let responseMessage = '';
    
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
            last_contact: timestamp,
            status: 'aguardando',
          })
          .eq('id', leadId);
      }
    } else {
      // Cria novo lead
      const { data: newLead } = await supabase
        .from('leads')
        .insert({
          phone, 
          name: name || phone, 
          last_contact: timestamp,
          source: 'whatsapp_webhook',
          status: 'novo'
        })
        .select()
        .single();
      
      leadId = newLead.id;
      
      // Mensagem de boas-vindas para novos leads
      responseMessage = `Olá! Sou a Sueli, assistente virtual da Bone Heal. Como posso te ajudar hoje? 😊\n\nPosso te dar informações sobre nossos produtos odontológicos premium, condições especiais e muito mais!`;
    }
    
    // Registrar mensagem recebida
    await supabase.from('whatsapp_messages').insert({
      lead_id: leadId,
      message,
      direction: 'inbound',
      sent_by: 'cliente'
    });
    
    // Classificar intenção da mensagem se não estiver em atendimento humano
    if (!needsHumanAgent) {
      // Palavras-chave para identificar solicitação de transferência para humano
      const humanKeywords = ['humano', 'pessoa', 'atendente', 'falar com gente', 'falar com pessoa', 'pessoa real'];
      
      if (humanKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        needsHumanAgent = true;
        responseMessage = "Vou transferir você para um atendente humano. Aguarde um momento, por favor.";
        
        // Atualizar status do lead
        await supabase
          .from('leads')
          .update({
            status: 'aguardando_atendente',
            needs_human: true
          })
          .eq('id', leadId);
      } else if (geminiApiKey) {
        try {
          // Analisar a mensagem com Gemini API
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
                const parsedResponse = JSON.parse(jsonMatch[0]);
                
                responseMessage = parsedResponse.resposta;
                
                // Atualizar classificação e status do lead
                await supabase
                  .from('leads')
                  .update({
                    intention: parsedResponse.intencao,
                    needs_human: parsedResponse.transferir,
                    status: parsedResponse.transferir ? 'aguardando_atendente' : 'atendido_bot'
                  })
                  .eq('id', leadId);
                  
                needsHumanAgent = parsedResponse.transferir;
              } else {
                // Fallback se não conseguir extrair JSON
                responseMessage = "Olá! Recebemos sua mensagem e estamos analisando. Logo entraremos em contato!";
              }
            } catch (parseError) {
              console.error('Erro ao processar resposta do Gemini:', parseError);
              responseMessage = "Olá! Recebemos sua mensagem e estamos analisando. Logo entraremos em contato!";
            }
          }
        } catch (aiError) {
          console.error('Erro ao consultar Gemini API:', aiError);
          responseMessage = "Olá! Recebemos sua mensagem e estamos analisando. Logo entraremos em contato!";
        }
      } else {
        // Resposta genérica se não tiver API Gemini configurada
        responseMessage = "Olá! Obrigado por entrar em contato com a Bone Heal. Um dos nossos especialistas irá atendê-lo em breve.";
      }
    }
    
    // Se não estiver marcado para atendimento humano e tiver resposta, enviar mensagem
    if (!needsHumanAgent && responseMessage) {
      // Enviar resposta automática
      const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
      const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
      const zApiInstanceId = Deno.env.get('ZAPI_INSTANCE_ID');
      const zApiToken = Deno.env.get('ZAPI_TOKEN');
      
      // Escolha a API apropriada para enviar a resposta
      if (evolutionApiUrl && evolutionApiKey) {
        // Usar a mesma instância que recebeu a mensagem, se disponível
        const instanceId = isEvolutionApi && payload.instance ? payload.instance : 'default';
        
        // Enviar mensagem pela Evolution API
        await fetch(`${evolutionApiUrl}/message/sendText/${instanceId}`, {
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
              text: responseMessage
            }
          }),
        });
      } else if (zApiInstanceId && zApiToken) {
        // Fallback para Z-API
        await fetch(`https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            message: responseMessage,
          }),
        });
      }
      
      // Registrar mensagem enviada
      await supabase.from('whatsapp_messages').insert({
        lead_id: leadId,
        message: responseMessage,
        direction: 'outbound',
        sent_by: 'bot'
      });
    }
    
    // Notificar administradores se necessário atendimento humano
    if (needsHumanAgent) {
      // Notificar via Supabase Realtime ou outro meio
      await supabase.from('notifications').insert({
        type: 'whatsapp_human_needed',
        lead_id: leadId,
        message: `Cliente ${name || phone} precisa de atendimento humano via WhatsApp`,
        status: 'pending'
      });
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
