
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
    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obter configurações da Evolution API
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');

    if (!evolutionApiUrl || !evolutionApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Evolution API não configurada. Configure EVOLUTION_API_URL e EVOLUTION_API_KEY.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Obter dados da solicitação
    const body = await req.json();
    const { action, instanceName = 'default' } = body;

    // Validar nome da instância
    if (!instanceName.match(/^[a-zA-Z0-9_-]+$/)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Nome de instância inválido. Use apenas letras, números, hífens e sublinhados.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Base URL da Evolution API
    const baseUrl = `${evolutionApiUrl}/instance`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': evolutionApiKey
    };

    // Executar ação com base no parâmetro action
    switch (action) {
      case 'getInstance':
        // Verificar se a instância já existe ou criar uma nova
        const checkResp = await fetch(`${baseUrl}/fetchInstances`, {
          method: 'GET',
          headers
        });
        
        const instances = await checkResp.json();
        
        if (instances.instances?.includes(instanceName)) {
          // Instância já existe
          return new Response(
            JSON.stringify({ success: true, message: 'Instância já existe', instance: instanceName }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Criar nova instância
          const createResp = await fetch(`${baseUrl}/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ instanceName })
          });
          
          const createResult = await createResp.json();
          console.log("Resposta da criação de instância:", JSON.stringify(createResult));
          
          return new Response(
            JSON.stringify({ 
              success: createResult.success === true, 
              message: createResult.message || 'Instância criada com sucesso', 
              instance: instanceName 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'getQRCode':
        // Gerar QR Code para a instância
        const qrResp = await fetch(`${baseUrl}/${instanceName}/qrcode`, {
          method: 'GET',
          headers
        });
        
        const qrResult = await qrResp.json();
        console.log("Resposta do QR Code:", JSON.stringify(qrResult));
        
        if (qrResult.qrcode) {
          // Atualizar o QR code no banco de dados
          const { error } = await supabase
            .from('whatsapp_instances')
            .upsert({
              instance_name: instanceName,
              qr_code: qrResult.qrcode,
              status: 'awaiting_connection',
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'instance_name'
            });
            
          if (error) {
            console.error("Erro ao atualizar QR code no banco:", error.message);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: qrResult.success === true, 
            message: qrResult.message || 'QR Code gerado com sucesso', 
            qrcode: qrResult.qrcode,
            status: qrResult.status
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getConnectionStatus':
        // Verificar status da conexão da instância
        const statusResp = await fetch(`${baseUrl}/${instanceName}/fetchConnectionState`, {
          method: 'GET',
          headers
        });
        
        const statusResult = await statusResp.json();
        console.log("Resposta do status de conexão:", JSON.stringify(statusResult));
        
        // Atualizar o status no banco de dados
        if (statusResult.status) {
          const { error } = await supabase
            .from('whatsapp_instances')
            .upsert({
              instance_name: instanceName,
              status: statusResult.status,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'instance_name'
            });
            
          if (error) {
            console.error("Erro ao atualizar status no banco:", error.message);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: statusResult.success === true, 
            message: statusResult.message || 'Status obtido com sucesso', 
            status: statusResult.status 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'sendMessage':
        // Enviar mensagem do WhatsApp
        const { phone, message } = body;
        
        if (!phone || !message) {
          return new Response(
            JSON.stringify({ success: false, message: 'Telefone e mensagem são obrigatórios' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        const sendResp = await fetch(`${baseUrl}/${instanceName}/sendText`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            number: phone, 
            textMessage: message 
          })
        });
        
        const sendResult = await sendResp.json();
        console.log("Resposta do envio de mensagem:", JSON.stringify(sendResult));
        
        return new Response(
          JSON.stringify({ 
            success: sendResult.success === true, 
            message: sendResult.message || 'Mensagem enviada com sucesso',
            result: sendResult 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Ação não reconhecida' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro na função:', error.message);
    return new Response(
      JSON.stringify({ success: false, message: `Erro: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
