import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OMIE_API_URL = 'https://app.omie.com.br/api/v1'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action } = await req.json()

    switch (action) {
      case 'sync_order': {
        const { order_id } = await req.json()
        
        // Get order details from database
        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', order_id)
          .single()

        if (orderError) throw orderError

        // Create order in OMIE
        const omieOrder = {
          cabecalho: {
            codigo_cliente: order.user_id,
            data_previsao: new Date().toISOString().split('T')[0],
            etapa: "10", // Initial status
            codigo_pedido: order.id,
          },
          det: order.items.map((item: any) => ({
            produto: {
              codigo_produto: item.id,
              descricao: item.name,
            },
            inf_adic: {
              peso_liquido: 0, // Add actual weight when available
              peso_bruto: 0,   // Add actual weight when available
            },
            quantidade: item.quantity,
            valor_unitario: item.price,
          })),
        }

        const omieResponse = await fetch(`${OMIE_API_URL}/produtos/pedido/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            call: 'IncluirPedido',
            app_key: Deno.env.get('OMIE_APP_KEY'),
            app_secret: Deno.env.get('OMIE_APP_SECRET'),
            param: [omieOrder],
          }),
        })

        const omieData = await omieResponse.json()

        // Update order with OMIE ID
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            omie_order_id: omieData.codigo_pedido,
            omie_status: 'novo',
            omie_last_update: new Date().toISOString(),
          })
          .eq('id', order_id)

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'check_status': {
        const { order_id } = await req.json()
        
        // Get order details from database
        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', order_id)
          .single()

        if (orderError) throw orderError

        // Check order status in OMIE
        const omieResponse = await fetch(`${OMIE_API_URL}/produtos/pedido/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            call: 'ConsultarPedido',
            app_key: Deno.env.get('OMIE_APP_KEY'),
            app_secret: Deno.env.get('OMIE_APP_SECRET'),
            param: [{
              codigo_pedido: order.omie_order_id,
            }],
          }),
        })

        const omieData = await omieResponse.json()

        // Map OMIE status to our status
        let status = 'novo'
        switch (omieData.etapa) {
          case '10': status = 'novo'; break;
          case '20': status = 'aguardando_pagamento'; break;
          case '30': status = 'pago'; break;
          case '40': status = 'faturando'; break;
          case '50': status = 'faturado'; break;
          case '60': status = 'separacao'; break;
          case '70': status = 'aguardando_envio'; break;
          case '80': status = 'enviado'; break;
          case '90': status = 'entregue'; break;
          case '100': status = 'cancelado'; break;
        }

        // Update order status
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            omie_status: status,
            omie_last_update: new Date().toISOString(),
          })
          .eq('id', order_id)

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ success: true, status }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})