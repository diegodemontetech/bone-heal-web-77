
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Se estiver apenas verificando configurações
    if (getConfig) {
      // Buscar secretos para retornar configurações
      const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL') || '';
      const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY') || '';
      const zApiInstanceId = Deno.env.get('ZAPI_INSTANCE_ID') || '';
      const zApiToken = Deno.env.get('ZAPI_TOKEN') || '';

      return new Response(
        JSON.stringify({ 
          success: true, 
          config: {
            evolutionApiUrl,
            evolutionApiKey: evolutionApiKey ? '[CONFIGURADO]' : '',
            zApiInstanceId,
            zApiToken: zApiToken ? '[CONFIGURADO]' : ''
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se Evolution API está configurada
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');

    // Se Evolution API estiver configurada, usar ela
    if (evolutionApiUrl && evolutionApiKey) {
      if (!phone || !message) {
        return new Response(
          JSON.stringify({ success: false, message: 'Telefone e mensagem são obrigatórios' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Tentar enviar mensagem via Evolution API
      const baseUrl = `${evolutionApiUrl}/instance`;
      const headers = {
        'Content-Type': 'application/json',
        'apikey': evolutionApiKey
      };
      
      // Verificar status da instância antes de enviar
      try {
        const statusResp = await fetch(`${baseUrl}/${instanceName}/fetchConnectionState`, {
          method: 'GET',
          headers
        });
        
        if (!statusResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao verificar status da instância: ${statusResp.status} ${statusResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        const statusResult = await statusResp.json();
        console.log("Status da instância:", JSON.stringify(statusResult));

        if (statusResult.status !== 'connected') {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Instância não está conectada. Gere o QR Code e escaneie com seu WhatsApp.' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
      } catch (error) {
        console.error("Erro ao verificar status da instância:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Erro ao verificar status da instância: ${error.message}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Enviar mensagem
      try {
        const sendResp = await fetch(`${baseUrl}/${instanceName}/sendText`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            number: phone.replace(/\D/g, ''), // Remover caracteres não numéricos
            textMessage: message 
          })
        });
        
        if (!sendResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao enviar mensagem: ${sendResp.status} ${sendResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        const sendResult = await sendResp.json();
        console.log("Resposta do envio:", JSON.stringify(sendResult));
        
        // Registrar a mensagem no banco de dados
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL');
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
          
          if (!supabaseUrl || !supabaseKey) {
            console.error("Credenciais do Supabase não definidas");
            return new Response(
              JSON.stringify({ 
                success: sendResult.success, 
                message: 'Mensagem enviada, mas não foi possível registrá-la no banco de dados',
                result: sendResult
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
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
            } else {
              leadId = newLead.id;
            }
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
        } catch (dbError) {
          console.error("Erro ao interagir com banco de dados:", dbError.message);
        }
        
        return new Response(
          JSON.stringify({ 
            success: sendResult.success, 
            message: sendResult.message || 'Mensagem enviada com sucesso',
            result: sendResult
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (sendError) {
        console.error("Erro ao enviar mensagem:", sendError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Erro ao enviar mensagem: ${sendError.message}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Verificar se Z-API está configurada como alternativa
    const zApiInstanceId = Deno.env.get('ZAPI_INSTANCE_ID');
    const zApiToken = Deno.env.get('ZAPI_TOKEN');

    if (zApiInstanceId && zApiToken) {
      if (!phone || !message) {
        return new Response(
          JSON.stringify({ success: false, message: 'Telefone e mensagem são obrigatórios' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Enviar mensagem via Z-API
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
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro na resposta Z-API: ${zApiResp.status} ${zApiResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        const zApiResult = await zApiResp.json();
        console.log("Resposta Z-API:", JSON.stringify(zApiResult));
        
        return new Response(
          JSON.stringify({ 
            success: zApiResult.status === 'success', 
            message: 'Mensagem enviada via Z-API',
            result: zApiResult
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (zApiError) {
        console.error("Erro ao enviar mensagem via Z-API:", zApiError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Erro ao enviar mensagem via Z-API: ${zApiError.message}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Nenhuma API configurada
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Nenhuma API de WhatsApp configurada. Configure EVOLUTION_API_URL e EVOLUTION_API_KEY ou ZAPI_INSTANCE_ID e ZAPI_TOKEN.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  } catch (error) {
    console.error('Erro na função:', error.message);
    return new Response(
      JSON.stringify({ success: false, message: `Erro: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
