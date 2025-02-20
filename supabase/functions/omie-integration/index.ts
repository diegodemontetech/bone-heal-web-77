
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Omie Integration Function Started");

serve(async (req) => {
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

    const existingClientPayload = {
      call: "ConsultarCliente",
      app_key: Deno.env.get("OMIE_APP_KEY"),
      app_secret: Deno.env.get("OMIE_APP_SECRET"),
      param: [{
        codigo_cliente_omie: order_data.profiles.omie_code
      }]
    };

    console.log("Consultando cliente existente:", order_data.profiles.omie_code);

    const consultaResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(existingClientPayload)
    });

    const clienteExistente = await consultaResponse.json();
    console.log("Cliente existente:", clienteExistente);

    if (!clienteExistente.faultstring) {
      // Atualizar o cliente existente com as configurações necessárias
      const updatePayload = {
        call: "AlterarCliente",
        app_key: Deno.env.get("OMIE_APP_KEY"),
        app_secret: Deno.env.get("OMIE_APP_SECRET"),
        param: [{
          ...clienteExistente,
          inativo: "N",
          pessoa_fisica: clienteExistente.cnpj_cpf?.length === 11 ? "S" : "N",
          contribuinte: "2",
          tags: ["ecommerce", "cliente_ativo"],
          recomendacoes: {
            tipo_distribuicao: "1",
            regime_tributario: "1",
            gerar_boletos: "N"
          }
        }]
      };

      console.log("Atualizando cliente:", JSON.stringify(updatePayload, null, 2));

      const updateResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      const updateResult = await updateResponse.json();
      console.log("Resultado da atualização:", updateResult);

      if (updateResult.faultstring) {
        throw new Error(`Erro ao atualizar cliente: ${updateResult.faultstring}`);
      }
    }

    // Gerar um código de pedido com no máximo 15 caracteres
    const timestamp = Date.now().toString().slice(-5);
    const codigoPedido = `W${timestamp}`; // W + 5 dígitos = 6 caracteres no total

    const items = order_data.items.map((item: any, index: number) => ({
      item_pedido: index + 1,
      codigo_produto: item.omie_code,
      quantidade: item.quantity,
      valor_unitario: item.price,
      codigo_item_integracao: `${order_id}_${item.product_id}`
    }));

    const pedidoPayload = {
      call: "IncluirPedido",
      app_key: Deno.env.get("OMIE_APP_KEY"),
      app_secret: Deno.env.get("OMIE_APP_SECRET"),
      param: [{
        cabecalho: {
          codigo_cliente: parseInt(order_data.profiles.omie_code),
          codigo_pedido: codigoPedido,
          codigo_pedido_integracao: order_id,
          data_previsao: new Date().toISOString().split('T')[0],
          etapa: "10",
          origem_pedido: "API"
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

    console.log("Enviando pedido para Omie:", JSON.stringify(pedidoPayload, null, 2));

    const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoPayload)
    });

    const omieData = await omieResponse.json();
    console.log("Resposta da API do Omie:", omieData);

    if (omieData.faultstring) {
      throw new Error(`Erro na API do Omie: ${omieData.faultstring}`);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('orders')
      .update({
        omie_order_id: omieData.pedido_id || codigoPedido,
        omie_status: 'sincronizado',
        omie_last_update: new Date().toISOString()
      })
      .eq('id', order_id);

    return new Response(
      JSON.stringify({
        success: true,
        omie_order_id: omieData.pedido_id || codigoPedido,
        message: 'Order synchronized successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in omie-integration function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
