
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("omie-integration function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, order_id } = await req.json()

    if (action !== 'sync_order') {
      throw new Error('Invalid action')
    }

    console.log('Fetching order:', order_id)

    // Fetch order with customer profile in a single query
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        customer:profiles(*)
      `)
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      throw new Error(`Error fetching order: ${orderError?.message || 'Order not found'}`)
    }

    console.log('Order fetched:', JSON.stringify(order, null, 2))
    
    if (!order.customer) {
      throw new Error('Customer profile not found for order')
    }

    // Prepare customer data for Omie
    const customerData = {
      codigo_cliente_omie: order.customer.omie_code,
      razao_social: order.customer.full_name,
      cnpj_cpf: order.customer.cpf,
      telefone1_numero: order.customer.phone?.replace(/\D/g, '') || '',
      endereco: order.shipping_address?.address || order.customer.address || '',
      endereco_numero: order.customer.endereco_numero || 'S/N',
      complemento: order.customer.complemento || '',
      bairro: order.shipping_address?.neighborhood || order.customer.neighborhood || '',
      estado: order.shipping_address?.state || order.customer.state || '',
      cidade: order.shipping_address?.city || order.customer.city || '',
      cep: order.shipping_address?.zip_code || order.customer.zip_code || '',
      contribuinte: 'N', // Always set as non-contributor
      pessoa_fisica: 'S', // Always set as individual
      estado_ibge: order.customer.estado_ibge || '',
      cidade_ibge: order.customer.cidade_ibge || '',
    }

    // Prepare items data
    const items = order.items.map((item: any) => ({
      codigo_produto: item.omie_code,
      codigo_produto_integracao: item.omie_product_id,
      quantidade: item.quantity,
      valor_unitario: item.price,
    }))

    // Build Omie request payload
    const omiePayload = {
      call: "IncluirPedido",
      app_key: Deno.env.get('OMIE_APP_KEY'),
      app_secret: Deno.env.get('OMIE_APP_SECRET'),
      param: [{
        cabecalho: {
          codigo_cliente: customerData.codigo_cliente_omie,
          data_previsao: new Date().toISOString().split('T')[0],
          etapa: "10", // Ordem de serviço
          codigo_parcela: "000",
        },
        det: items.map(item => ({
          produto: {
            codigo_produto: item.codigo_produto,
            codigo_produto_integracao: item.codigo_produto_integracao,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
          }
        })),
        cliente_cadastro: customerData
      }]
    }

    console.log('Sending request to Omie:', JSON.stringify(omiePayload, null, 2))

    // Send request to Omie API
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(omiePayload)
    })

    const omieData = await omieResponse.json()
    
    if (!omieResponse.ok) {
      console.error('Omie API error:', omieData)
      throw new Error(`Omie API error: ${JSON.stringify(omieData)}`)
    }

    console.log('Omie response:', omieData)

    // Update order with Omie information
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        omie_order_id: omieData.numero_pedido?.toString(),
        omie_status: 'sincronizado',
        omie_last_update: new Date().toISOString()
      })
      .eq('id', order_id)

    if (updateError) {
      throw new Error(`Error updating order: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        omie_order_id: omieData.numero_pedido,
        message: 'Order synchronized successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
