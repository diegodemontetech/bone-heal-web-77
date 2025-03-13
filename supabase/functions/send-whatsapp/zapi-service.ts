
import { ApiResponse, SendMessageOptions, WhatsAppConfig } from "../_shared/types.ts";

// Serviço para interagir com a Z-API
export async function sendMessageViaZAPI(
  options: SendMessageOptions,
  config: WhatsAppConfig
): Promise<ApiResponse> {
  const { phone, message } = options;
  const { zApiInstanceId, zApiToken } = config;

  if (!zApiInstanceId || !zApiToken) {
    return {
      success: false,
      message: 'Z-API não configurada corretamente'
    };
  }

  try {
    const zApiUrl = `https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-text`;
    
    const zApiResp = await fetch(zApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone: phone.replace(/\D/g, ''), 
        message 
      })
    });
    
    if (!zApiResp.ok) {
      return {
        success: false,
        message: `Erro na resposta Z-API: ${zApiResp.status} ${zApiResp.statusText}`
      };
    }
    
    const zApiResult = await zApiResp.json();
    console.log("Resposta Z-API:", JSON.stringify(zApiResult));
    
    return {
      success: zApiResult.status === 'success', 
      message: 'Mensagem enviada via Z-API',
      result: zApiResult
    };
  } catch (error: any) {
    console.error("Erro ao enviar mensagem via Z-API:", error);
    return {
      success: false,
      message: `Erro ao enviar mensagem via Z-API: ${error.message}`
    };
  }
}
