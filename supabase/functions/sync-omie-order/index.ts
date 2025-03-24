
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY');
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse request body
    const { order_id, payment_data, is_paid = false } = await req.json();
    
    if (!order_id) {
      throw new Error('Missing required parameter: order_id');
    }
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles: user_id (
          id, 
          full_name, 
          email, 
          phone,
          cpf,
          cnpj,
          address,
          endereco_numero,
          complemento,
          neighborhood,
          city,
          state,
          zip_code,
          omie_code
        )
      `)
      .eq('id', order_id)
      .single();
    
    if (orderError) {
      throw new Error(`Failed to get order details: ${orderError.message}`);
    }
    
    if (!order) {
      throw new Error(`Order not found: ${order_id}`);
    }
    
    // Check if customer has Omie code
    if (!order.profiles.omie_code) {
      throw new Error(`Customer does not have Omie code. Please sync customer first.`);
    }
    
    // Parse order items
    const items = typeof order.items === 'string' 
      ? JSON.parse(order.items) 
      : order.items;
    
    // Format order items for Omie
    const cabecalho = {
      codigo_cliente: parseInt(order.profiles.omie_code),
      data_previsao: new Date().toISOString().split('T')[0],
      etapa: is_paid ? '50' : '10', // 10 = Pendente, 50 = Faturado
      codigo_parcela: '999', // A vista
      qtde_parcelas: 1,
      origem_operacao: 'W'
    };
    
    // Format items for Omie
    const det = items.map((item: any, index: number) => ({
      ide: {
        codigo_item_integracao: item.product_id || `${index}`,
      },
      produto: {
        codigo_produto: item.omie_code || item.product_id,
        codigo_produto_integracao: item.product_id,
        descricao: item.name,
        quantidade: item.quantity,
        valor_unitario: item.price,
        tipo_desconto: 'V',
        valor_desconto: 0
      },
      informacoes_adicionais: {
        codigo_categoria: '1.01.03',
        codigo_conta_corrente: '1.1.01.01.0002',
        data_previsao: new Date().toISOString().split('T')[0]
      }
    }));
    
    // Build Omie order
    const omieOrder = {
      call: 'IncluirPedido',
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        cabecalho,
        det,
        frete: {
          valor_frete: order.shipping_fee || 0,
          modalidade: 'C' // CIF - Frete por conta do emitente
        },
        informacoes_adicionais: {
          codigo_categoria: '1.01.03',
          codigo_conta_corrente: '1.1.01.01.0002',
          consumidor_final: 'S',
          enviar_email: 'S',
          enviar_email_nfe: 'S'
        }
      }]
    };
    
    // Send order to Omie
    const response = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(omieOrder)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create order in Omie: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Omie API response:', result);
    
    // Extract Omie order ID
    const omieOrderId = result.numero_pedido ? result.numero_pedido.toString() : null;
    
    if (!omieOrderId) {
      throw new Error('Failed to get Omie order ID from response');
    }
    
    // Update order with Omie ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        omie_order_id: omieOrderId,
        omie_status: is_paid ? 'faturado' : 'novo',
        omie_last_update: new Date().toISOString(),
        omie_last_sync_attempt: new Date().toISOString()
      })
      .eq('id', order_id);
    
    if (updateError) {
      throw new Error(`Failed to update order with Omie ID: ${updateError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Order synced with Omie successfully`,
        omie_order_id: omieOrderId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing Omie order sync:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error' 
      }),
      { 
        status: 200, // Always return 200 to avoid unexpected behaviors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
