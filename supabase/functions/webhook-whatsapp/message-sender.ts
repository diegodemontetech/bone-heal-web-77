
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
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

// Registra mensagem de resposta no banco de dados
export async function registerResponseMessage(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  message: string
): Promise<void> {
  await supabase.from('whatsapp_messages').insert({
    lead_id: leadId,
    message: message,
    direction: 'outbound',
    sent_by: 'bot'
  });
}
