
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Omie Integration Function Started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, order_id, order_data } = await req.json();
    console.log("Received request:", { action, order_id, order_data });

    if (action !== 'sync_order') {
      throw new Error('Invalid action');
    }

    if (!order_data || !order_data.items || !order_data.profiles) {
      throw new Error('Missing required order data');
    }

    // Preparar os dados do cliente
    const clienteData = {
      codigo_cliente_omie: order_data.profiles.omie_code,
      razao_social: order_data.profiles.full_name,
      cnpj_cpf: order_data.profiles.cpf || order_data.profiles.cnpj,
      telefone1_numero: order_data.profiles.phone,
      endereco: order_data.profiles.address,
      endereco_numero: "S/N",
      bairro: order_data.profiles.neighborhood || "Centro",
      estado: order_data.profiles.state,
      cidade: order_data.profiles.city,
      cep: order_data.profiles.zip_code,
      codigo_pais: "1058",
      email: order_data.profiles.email
    };

    // Preparar os itens do pedido
    const items = order_data.items.map((item: any, index: number) => ({
      item_pedido: index + 1,
      codigo_produto: item.omie_code,
      quantidade: item.quantity,
      valor_unitario: item.price,
      codigo_item_integracao: `${order_id}_${item.product_id}`
    }));

    // Montar o payload do pedido para o Omie
    const pedidoPayload = {
      call: "IncluirPedido",
      app_key: Deno.env.get("OMIE_APP_KEY"),
      app_secret: Deno.env.get("OMIE_APP_SECRET"),
      param: [{
        cabecalho: {
          codigo_cliente: parseInt(clienteData.codigo_cliente_omie),
          data_previsao: new Date().toISOString().split('T')[0],
          etapa: "10",
          codigo_pedido_integracao: order_id
        },
        det: items.map(item => ({
          produto: {
            codigo_produto: item.codigo_produto,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario
          }
        })),
        frete: {
          modalidade: "1",
          valor_frete: 0
        },
        informacoes_adicionais: {
          codigo_categoria: "1.01.01",
          codigo_conta_corrente: "2697531662",
          consumidor_final: "S",
          enviar_email: "N"
        }
      }]
    };

    console.log("Sending request to Omie:", JSON.stringify(pedidoPayload, null, 2));

    // Fazer a requisição para a API do Omie
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedidoPayload)
    });

    const omieData = await omieResponse.json();
    console.log("Omie API response:", omieData);

    if (!omieResponse.ok) {
      throw new Error(`Omie API error: ${JSON.stringify(omieData)}`);
    }

    // Atualizar o pedido no Supabase com o ID do Omie
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        omie_order_id: omieData.pedido_id,
        omie_status: 'sincronizado',
        omie_last_update: new Date().toISOString()
      })
      .eq('id', order_id);

    if (updateError) {
      throw new Error(`Error updating order: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        omie_order_id: omieData.pedido_id,
        message: 'Order synchronized successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in omie-integration function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Mantendo 200 para evitar o erro de non-2xx
      }
    );
  }
});
