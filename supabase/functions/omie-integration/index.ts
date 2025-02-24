
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
    const requestBody = await req.json();
    console.log("Received request body:", JSON.stringify(requestBody, null, 2));

    const { action, order_id } = requestBody;
    
    if (action !== 'sync_order') {
      throw new Error('Invalid action');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Fetching order data for ID:", order_id);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error(`Error fetching order: ${orderError?.message || 'Order not found'}`);
    }

    console.log("Retrieved order data:", JSON.stringify(order, null, 2));

    if (!order.profiles) {
      throw new Error('Profile information not found for order');
    }

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      throw new Error('Order does not have any items');
    }

    // Generate order code with maximum of 15 characters
    const timestamp = Date.now().toString().slice(-5);
    const codigoPedido = `W${timestamp}`;

    // Map order items ensuring all required fields are present
    const items = order.items.map((item: any, index: number) => {
      if (!item.omie_code || !item.omie_product_id) {
        throw new Error(`Missing Omie codes for item: ${item.name}`);
      }
      
      return {
        item_pedido: index + 1,
        codigo_produto: item.omie_code,
        quantidade: item.quantity,
        valor_unitario: item.price,
        codigo_item_integracao: `${order_id}_${item.product_id}`
      };
    });

    const pedidoPayload = {
      call: "IncluirPedido",
      app_key: Deno.env.get("OMIE_APP_KEY"),
      app_secret: Deno.env.get("OMIE_APP_SECRET"),
      param: [{
        cabecalho: {
          codigo_cliente: parseInt(order.profiles.omie_code),
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
          codigo_categoria: "1.01.03",
          codigo_conta_corrente: "2697531662",
          consumidor_final: "S",
          enviar_email: "N"
        }
      }]
    };

    console.log("Sending order to Omie:", JSON.stringify(pedidoPayload, null, 2));

    const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoPayload)
    });

    const omieData = await omieResponse.json();
    console.log("Omie API response:", JSON.stringify(omieData, null, 2));

    if (omieData.faultstring) {
      throw new Error(`Omie API error: ${omieData.faultstring}`);
    }

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
      { 
        status: 200, // Always return 200 even for errors to avoid Edge Function errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

