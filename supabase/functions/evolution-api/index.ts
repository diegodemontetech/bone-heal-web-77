
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
    const { 
      action,
      instanceName = 'default',
      websocketCode,
      phone,
      message
    } = body;

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
        
        if (!checkResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao verificar instâncias: ${checkResp.status} ${checkResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const instances = await checkResp.json();
        
        if (instances.instances?.includes(instanceName)) {
          // Instância já existe
          console.log(`Instância ${instanceName} já existe`);
          return new Response(
            JSON.stringify({ success: true, message: 'Instância já existe', instance: instanceName }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Criar nova instância
          console.log(`Criando nova instância: ${instanceName}`);
          const createResp = await fetch(`${baseUrl}/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ instanceName, webhook: Deno.env.get('SUPABASE_URL') + '/functions/v1/webhook-whatsapp' })
          });
          
          if (!createResp.ok) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Erro ao criar instância: ${createResp.status} ${createResp.statusText}` 
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }
          
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

      case 'deleteInstance':
        // Excluir uma instância
        console.log(`Excluindo instância: ${instanceName}`);
        const deleteResp = await fetch(`${baseUrl}/delete`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ instanceName })
        });
        
        if (!deleteResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao excluir instância: ${deleteResp.status} ${deleteResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const deleteResult = await deleteResp.json();
        console.log("Resposta da exclusão de instância:", JSON.stringify(deleteResult));
        
        return new Response(
          JSON.stringify({ 
            success: deleteResult.success === true, 
            message: deleteResult.message || 'Instância excluída com sucesso', 
            instance: instanceName 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getQRCode':
        // Gerar QR Code para a instância
        console.log(`Gerando QR Code para instância: ${instanceName}`);
        const qrResp = await fetch(`${baseUrl}/${instanceName}/qrcode`, {
          method: 'GET',
          headers
        });
        
        if (!qrResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao gerar QR Code: ${qrResp.status} ${qrResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const qrResult = await qrResp.json();
        console.log("Resposta do QR Code:", qrResult.message || 'QR Code gerado');
        
        if (qrResult.qrcode) {
          // Atualizar o QR code no banco de dados
          const { error } = await supabase
            .from('whatsapp_instances')
            .update({
              qr_code: qrResult.qrcode,
              status: 'awaiting_connection',
              updated_at: new Date().toISOString()
            })
            .eq('instance_name', instanceName);
            
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

      case 'connectWithWebsocket':
        // Conectar usando código do websocket (alternativa ao QR code)
        if (!websocketCode) {
          return new Response(
            JSON.stringify({ success: false, message: 'Código do websocket é obrigatório' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        console.log(`Conectando instância ${instanceName} com websocket`);
        const wsResp = await fetch(`${baseUrl}/${instanceName}/connect-session-code`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ code: websocketCode })
        });
        
        if (!wsResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao conectar com websocket: ${wsResp.status} ${wsResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const wsResult = await wsResp.json();
        console.log("Resposta da conexão com websocket:", JSON.stringify(wsResult));
        
        // Atualizar status no banco de dados
        if (wsResult.success) {
          const { error } = await supabase
            .from('whatsapp_instances')
            .update({
              status: 'connected',
              updated_at: new Date().toISOString()
            })
            .eq('instance_name', instanceName);
            
          if (error) {
            console.error("Erro ao atualizar status no banco:", error.message);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: wsResult.success === true, 
            message: wsResult.message || 'Instância conectada com sucesso', 
            instance: instanceName 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getConnectionStatus':
        // Verificar status da conexão da instância
        console.log(`Verificando status da instância: ${instanceName}`);
        const statusResp = await fetch(`${baseUrl}/${instanceName}/fetchConnectionState`, {
          method: 'GET',
          headers
        });
        
        if (!statusResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao verificar status: ${statusResp.status} ${statusResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const statusResult = await statusResp.json();
        console.log("Resposta do status de conexão:", JSON.stringify(statusResult));
        
        // Atualizar o status no banco de dados
        if (statusResult.status) {
          const { error } = await supabase
            .from('whatsapp_instances')
            .update({
              status: statusResult.status,
              updated_at: new Date().toISOString()
            })
            .eq('instance_name', instanceName);
            
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

      case 'logout':
        // Desconectar a instância
        console.log(`Desconectando instância: ${instanceName}`);
        const logoutResp = await fetch(`${baseUrl}/${instanceName}/logout`, {
          method: 'POST',
          headers
        });
        
        if (!logoutResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao desconectar: ${logoutResp.status} ${logoutResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const logoutResult = await logoutResp.json();
        console.log("Resposta do logout:", JSON.stringify(logoutResult));
        
        // Atualizar o status no banco de dados
        if (logoutResult.success) {
          const { error } = await supabase
            .from('whatsapp_instances')
            .update({
              status: 'disconnected',
              updated_at: new Date().toISOString()
            })
            .eq('instance_name', instanceName);
            
          if (error) {
            console.error("Erro ao atualizar status no banco:", error.message);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: logoutResult.success === true, 
            message: logoutResult.message || 'Instância desconectada com sucesso' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'sendMessage':
        // Enviar mensagem do WhatsApp
        if (!phone || !message) {
          return new Response(
            JSON.stringify({ success: false, message: 'Telefone e mensagem são obrigatórios' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        console.log(`Enviando mensagem para ${phone} via instância ${instanceName}`);
        const sendResp = await fetch(`${baseUrl}/${instanceName}/sendText`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            number: phone, 
            textMessage: message 
          })
        });
        
        if (!sendResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao enviar mensagem: ${sendResp.status} ${sendResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
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

      case 'refresh_qr':
        // Atualizar QR Code para uma instância específica pelo ID
        const instance_id = body.instance_id;
        
        if (!instance_id) {
          return new Response(
            JSON.stringify({ success: false, message: 'ID da instância não fornecido' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        
        // Buscar a instância no banco de dados
        const { data: instanceData, error: instanceError } = await supabase
          .from('whatsapp_instances')
          .select('*')
          .eq('id', instance_id)
          .single();
          
        if (instanceError || !instanceData) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Instância não encontrada' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          );
        }
        
        // Gerar QR Code para a instância encontrada
        console.log(`Atualizando QR Code para instância ${instanceData.instance_name} (ID: ${instance_id})`);
        const refreshQrResp = await fetch(`${baseUrl}/${instanceData.instance_name}/qrcode`, {
          method: 'GET',
          headers
        });
        
        if (!refreshQrResp.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Erro ao gerar QR Code: ${refreshQrResp.status} ${refreshQrResp.statusText}` 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        const refreshQrResult = await refreshQrResp.json();
        console.log("Resposta do QR Code atualizado:", refreshQrResult.message || 'QR Code gerado');
        
        if (refreshQrResult.qrcode) {
          // Atualizar o QR code no banco de dados
          const { error } = await supabase
            .from('whatsapp_instances')
            .update({
              qr_code: refreshQrResult.qrcode,
              status: 'awaiting_connection',
              updated_at: new Date().toISOString()
            })
            .eq('id', instance_id);
            
          if (error) {
            console.error("Erro ao atualizar QR code no banco:", error.message);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: refreshQrResult.success === true, 
            message: refreshQrResult.message || 'QR Code atualizado com sucesso',
            qrcode: refreshQrResult.qrcode,
            status: refreshQrResult.status
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
