
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { SendMessageOptions } from "../_shared/types.ts";
import { getWhatsAppConfig, hasAnyConfiguredService, hasEvolutionApi, hasZApi } from "./config-service.ts";
import { sendMessageViaEvolutionApi, registerMessageInDatabase } from "./evolution-api-service.ts";
import { sendMessageViaZAPI } from "./zapi-service.ts";

serve(async (req) => {
  // Tratar solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter dados da solicitação
    const requestData = await req.json().catch(() => null);
    
    // Verificar se os dados são válidos
    if (!requestData) {
      return new Response(
        JSON.stringify({ success: false, message: 'Dados de requisição inválidos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { getConfig, phone, message, instanceName = 'default' } = requestData;
    const config = getWhatsAppConfig();

    // Se estiver apenas verificando configurações
    if (getConfig) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          config: {
            evolutionApiUrl: config.evolutionApiUrl || '',
            evolutionApiKey: config.evolutionApiKey ? '[CONFIGURADO]' : '',
            zApiInstanceId: config.zApiInstanceId || '',
            zApiToken: config.zApiToken ? '[CONFIGURADO]' : ''
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se há algum serviço configurado
    if (!hasAnyConfiguredService(config)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Nenhuma API de WhatsApp configurada. Configure EVOLUTION_API_URL e EVOLUTION_API_KEY ou ZAPI_INSTANCE_ID e ZAPI_TOKEN.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validar parâmetros obrigatórios
    if (!phone || !message) {
      return new Response(
        JSON.stringify({ success: false, message: 'Telefone e mensagem são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const messageOptions: SendMessageOptions = {
      phone,
      message,
      instanceName
    };

    // Tentar enviar via Evolution API primeiro, se configurada
    if (hasEvolutionApi(config)) {
      const evolutionResult = await sendMessageViaEvolutionApi(messageOptions, config);
      
      if (evolutionResult.success) {
        try {
          // Registrar a mensagem no banco de dados
          const supabaseUrl = Deno.env.get('SUPABASE_URL');
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
          
          if (supabaseUrl && supabaseKey) {
            await registerMessageInDatabase(phone, message, supabaseUrl, supabaseKey);
          }
        } catch (dbError) {
          console.error("Erro ao registrar mensagem:", dbError);
        }
        
        return new Response(
          JSON.stringify(evolutionResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Se falhar e Z-API não estiver configurada, retornar o erro
      if (!hasZApi(config)) {
        return new Response(
          JSON.stringify(evolutionResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Senão, tentar Z-API como fallback
      console.log("Evolution API falhou, tentando Z-API como fallback");
    }

    // Enviar via Z-API (como primeira opção ou fallback)
    if (hasZApi(config)) {
      const zapiResult = await sendMessageViaZAPI(messageOptions, config);
      
      // Registrar a mensagem no banco de dados em caso de sucesso
      if (zapiResult.success) {
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL');
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
          
          if (supabaseUrl && supabaseKey) {
            await registerMessageInDatabase(phone, message, supabaseUrl, supabaseKey);
          }
        } catch (dbError) {
          console.error("Erro ao registrar mensagem:", dbError);
        }
      }
      
      return new Response(
        JSON.stringify(zapiResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: zapiResult.success ? 200 : 400 }
      );
    }

    // Este ponto só deve ser alcançado se algo deu muito errado na lógica
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro inesperado ao processar a solicitação' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  } catch (error: any) {
    console.error('Erro na função:', error.message);
    return new Response(
      JSON.stringify({ success: false, message: `Erro: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
