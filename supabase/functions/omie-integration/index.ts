
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log do request body completo
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Parse do JSON e log dos dados recebidos
    const requestData = JSON.parse(rawBody);
    console.log('Parsed request data:', requestData);

    const { action, order_id, order_data } = requestData;
    console.log('Dados extraídos:', { action, order_id, order_data });

    if (!requestData) {
      throw new Error('Nenhum dado recebido na requisição');
    }

    if (!order_data) {
      throw new Error('Dados do pedido não fornecidos. Request data: ' + JSON.stringify(requestData));
    }

    if (!order_data.profiles) {
      throw new Error('Dados do cliente não encontrados. Order data: ' + JSON.stringify(order_data));
    }

    // Validar dados obrigatórios do cliente
    const requiredFields = ['full_name', 'address', 'city', 'state', 'neighborhood', 'zip_code'];
    const missingFields = requiredFields.filter(field => !order_data.profiles[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }

    // Validar dados do pedido
    if (!order_data.items || !Array.isArray(order_data.items)) {
      throw new Error('Itens do pedido inválidos');
    }

    // Configuração do Omie
    const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY');
    const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET');

    if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
      throw new Error('Credenciais do Omie não configuradas');
    }

    // Preparar dados para o Omie
    const omieOrderData = {
      cabecalho: {
        codigo_cliente: parseInt(order_data.profiles.omie_code || '0'),
        etapa: '10', // Pedido
        codigo_parcela: '000',
        data_previsao: new Date().toISOString().split('T')[0],
      },
      det: order_data.items.map((item: any) => ({
        produto: {
          codigo_produto: item.product_id,
          quantidade: item.quantity,
          valor_unitario: parseFloat(item.price),
        },
      })),
      frete: {
        modalidade: 'CIF',
        valor_frete: parseFloat(order_data.shipping_fee || '0'),
      },
    };

    console.log('Dados formatados para o Omie:', omieOrderData);

    // Enviar para o Omie
    const response = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: 'IncluirPedido',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [omieOrderData],
      }),
    });

    const responseText = await response.text();
    console.log('Resposta bruta do Omie:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Erro ao parsear resposta do Omie: ${responseText}`);
    }

    if (!response.ok) {
      console.error('Erro na resposta do Omie:', responseData);
      throw new Error(`Erro ao sincronizar com Omie: ${responseData.faultstring || 'Erro desconhecido'}`);
    }

    console.log('Resposta do Omie:', responseData);

    // Atualizar status do pedido no Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        omie_order_id: responseData.codigo_pedido,
        omie_status: 'sincronizado',
        omie_last_update: new Date().toISOString(),
      })
      .eq('id', order_id);

    if (updateError) {
      throw new Error(`Erro ao atualizar pedido no Supabase: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Pedido sincronizado com sucesso',
      omie_order_id: responseData.codigo_pedido 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na sincronização:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Erro desconhecido na sincronização' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
