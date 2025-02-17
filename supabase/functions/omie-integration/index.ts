
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface OmieOrderRequest {
  call: string;
  app_key: string;
  app_secret: string;
  param: any[];
}

interface ShippingConfig {
  carrier: string;
  omie_carrier_code: string;
  omie_service_code: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string
    const omieAppKey = Deno.env.get('OMIE_APP_KEY') as string
    const omieAppSecret = Deno.env.get('OMIE_APP_SECRET') as string

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { action, order_id } = await req.json()

    if (action === 'sync_order') {
      // Buscar pedido no Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            full_name,
            cpf,
            cnpj,
            address,
            city,
            state,
            zip_code,
            phone,
            omie_code
          )
        `)
        .eq('id', order_id)
        .single()

      if (orderError || !order) {
        throw new Error('Pedido não encontrado')
      }

      // Buscar configuração de frete
      const { data: shippingConfig } = await supabase
        .from('shipping_configs')
        .select('*')
        .eq('active', true)
        .single()

      // Preparar dados para o Omie
      const orderData = {
        cabecalho: {
          codigo_cliente: order.profiles.omie_code,
          data_previsao: new Date().toISOString().split('T')[0],
          etapa: '10', // Pedido Realizado
          codigo_pedido: order.id,
        },
        frete: {
          modalidade: "1", // CIF
          transportadora: shippingConfig?.omie_carrier_code || "",
          codigo_servico_correios: shippingConfig?.omie_service_code || "",
          valor_frete: order.shipping_fee
        },
        det: order.items.map((item: any) => ({
          produto: {
            codigo: item.product_id,
            quantidade: item.quantity,
            valor_unitario: item.price
          }
        }))
      }

      // Enviar pedido para o Omie
      const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          call: 'IncluirPedido',
          app_key: omieAppKey,
          app_secret: omieAppSecret,
          param: [orderData]
        })
      })

      const omieData = await omieResponse.json()

      if (omieData.faultstring) {
        throw new Error(omieData.faultstring)
      }

      // Atualizar pedido no Supabase
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          omie_order_id: omieData.codigo_pedido,
          omie_status: 'novo',
          omie_last_sync_attempt: new Date().toISOString()
        })
        .eq('id', order_id)

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({ success: true, omie_order_id: omieData.codigo_pedido }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    else if (action === 'check_status') {
      // Buscar pedido no Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order_id)
        .single()

      if (orderError || !order || !order.omie_order_id) {
        throw new Error('Pedido não encontrado ou não sincronizado com Omie')
      }

      // Consultar status no Omie
      const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          call: 'ConsultarPedido',
          app_key: omieAppKey,
          app_secret: omieAppSecret,
          param: [{
            codigo_pedido: order.omie_order_id
          }]
        })
      })

      const omieData = await omieResponse.json()

      if (omieData.faultstring) {
        throw new Error(omieData.faultstring)
      }

      // Mapear status do Omie para nosso sistema
      const statusMap: Record<string, string> = {
        '10': 'novo',
        '20': 'aguardando_pagamento',
        '30': 'pago',
        '40': 'faturando',
        '50': 'faturado',
        '60': 'separacao',
        '70': 'aguardando_envio',
        '80': 'enviado',
        '90': 'entregue',
        '100': 'cancelado'
      }

      const newStatus = statusMap[omieData.etapa] || order.omie_status

      // Atualizar pedido no Supabase
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          omie_status: newStatus,
          omie_invoice_number: omieData.numero_nf || order.omie_invoice_number,
          omie_invoice_key: omieData.chave_nf || order.omie_invoice_key,
          omie_invoice_date: omieData.data_nf || order.omie_invoice_date,
          omie_tracking_code: omieData.codigo_rastreio || order.omie_tracking_code,
          omie_shipping_company: omieData.transportadora || order.omie_shipping_company,
          omie_last_sync_attempt: new Date().toISOString()
        })
        .eq('id', order_id)

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: newStatus,
          tracking: omieData.codigo_rastreio
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Ação inválida')

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
