
import { ApiResponse, SendMessageOptions, WhatsAppConfig } from "../_shared/types.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

// Serviço para interagir com a Evolution API
export async function sendMessageViaEvolutionApi(
  options: SendMessageOptions,
  config: WhatsAppConfig
): Promise<ApiResponse> {
  const { phone, message, instanceName = 'default' } = options;
  const { evolutionApiUrl, evolutionApiKey } = config;

  if (!evolutionApiUrl || !evolutionApiKey) {
    return {
      success: false,
      message: 'Evolution API não configurada corretamente'
    };
  }

  // Verificar status da instância antes de enviar
  try {
    const baseUrl = `${evolutionApiUrl}/instance`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': evolutionApiKey
    };
    
    const statusResp = await fetch(`${baseUrl}/${instanceName}/fetchConnectionState`, {
      method: 'GET',
      headers
    });
    
    if (!statusResp.ok) {
      return {
        success: false,
        message: `Erro ao verificar status da instância: ${statusResp.status} ${statusResp.statusText}`
      };
    }
    
    const statusResult = await statusResp.json();
    console.log("Status da instância:", JSON.stringify(statusResult));

    if (statusResult.status !== 'connected') {
      return {
        success: false,
        message: 'Instância não está conectada. Gere o QR Code e escaneie com seu WhatsApp.'
      };
    }
    
    // Enviar mensagem
    const sendResp = await fetch(`${baseUrl}/${instanceName}/sendText`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        number: phone.replace(/\D/g, ''), // Remover caracteres não numéricos
        textMessage: message 
      })
    });
    
    if (!sendResp.ok) {
      return {
        success: false,
        message: `Erro ao enviar mensagem: ${sendResp.status} ${sendResp.statusText}`
      };
    }
    
    const sendResult = await sendResp.json();
    console.log("Resposta do envio:", JSON.stringify(sendResult));
    
    return {
      success: sendResult.success,
      message: sendResult.message || 'Mensagem enviada com sucesso',
      result: sendResult
    };
  } catch (error: any) {
    console.error("Erro ao enviar mensagem via Evolution API:", error);
    return {
      success: false,
      message: `Erro ao enviar mensagem: ${error.message}`
    };
  }
}

// Registrar a mensagem no banco de dados
export async function registerMessageInDatabase(
  phone: string,
  message: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se o lead existe ou criar um novo
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('phone', phone)
      .single();

    let leadId;
    
    if (leadError || !leadData) {
      // Criar novo lead
      const { data: newLead, error: newLeadError } = await supabase
        .from('leads')
        .insert({
          phone,
          name: 'Cliente WhatsApp',
          status: 'novo',
          source: 'whatsapp'
        })
        .select('id')
        .single();
        
      if (newLeadError) {
        console.error("Erro ao criar lead:", newLeadError.message);
        return;
      }
      
      leadId = newLead.id;
    } else {
      leadId = leadData.id;
    }

    if (leadId) {
      // Registrar mensagem
      const { error: msgError } = await supabase
        .from('whatsapp_messages')
        .insert({
          lead_id: leadId,
          message,
          direction: 'outgoing',
          is_bot: true
        });
        
      if (msgError) {
        console.error("Erro ao registrar mensagem:", msgError.message);
      }
    }
  } catch (dbError: any) {
    console.error("Erro ao interagir com banco de dados:", dbError.message);
  }
}
