
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OmieConfig {
  app_key: string
  app_secret: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const config: OmieConfig = {
      app_key: Deno.env.get('OMIE_APP_KEY') || '',
      app_secret: Deno.env.get('OMIE_APP_SECRET') || '',
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { orderId } = await req.json()
    console.log('Fetching order:', orderId)

    // Buscar o pedido com os dados do usuário
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          cpf,
          cnpj,
          address,
          city,
          state,
          zip_code,
          phone,
          email,
          pessoa_fisica,
          endereco_numero,
          complemento,
          cidade_ibge,
          estado_ibge,
          contribuinte,
          tipo_atividade,
          exterior,
          bloqueado,
          inativo,
          optante_simples_nacional
        )
      `)
      .eq('id', orderId)
      .single()

    console.log('Order fetched:', order)

    if (orderError) throw orderError
    if (!order) throw new Error('Order not found')
    if (!order.profiles) throw new Error('Customer profile not found')

    const customer = order.profiles
    const cpfCnpj = customer.pessoa_fisica ? customer.cpf : customer.cnpj

    // Preparar o cliente para o Omie
    const clienteOmie = {
      call: "UpsertClient",
      app_key: config.app_key,
      app_secret: config.app_secret,
      param: [{
        codigo_cliente_integracao: customer.id,
        email: customer.email,
        razao_social: customer.full_name,
        cnpj_cpf: cpfCnpj,
        telefone1_ddd: customer.phone?.substring(0, 2) || "",
        telefone1_numero: customer.phone?.substring(2) || "",
        endereco: customer.address,
        endereco_numero: customer.endereco_numero,
        complemento: customer.complemento || "",
        bairro: customer.neighborhood,
        estado: customer.state,
        cidade: customer.city,
        cep: customer.zip_code,
        pessoa_fisica: customer.pessoa_fisica ? "S" : "N",
        cidade_ibge: customer.cidade_ibge,
        estado_ibge: customer.estado_ibge,
        contribuinte: customer.contribuinte,
        tipo_atividade: customer.tipo_atividade,
        exterior: customer.exterior ? "S" : "N",
        bloqueado: customer.bloqueado ? "S" : "N",
        inativo: customer.inativo ? "S" : "N",
        optante_simples_nacional: customer.optante_simples_nacional ? "S" : "N"
      }]
    }

    // Enviar cliente para o Omie
    console.log('Sending request to Omie:', clienteOmie)
    const clientResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      body: JSON.stringify(clienteOmie),
      headers: { 'Content-Type': 'application/json' }
    })

    const clientResult = await clientResponse.json()
    console.log('Client response:', clientResult)

    if (clientResult.faultstring) {
      throw new Error(`Omie API error: ${clientResult.faultstring}`)
    }

    // Preparar os itens do pedido
    const items = order.items.map((item: any) => ({
      codigo_produto: item.omie_code,
      quantidade: item.quantity,
      valor_unitario: item.price
    }))

    // Criar o pedido no Omie
    const pedidoOmie = {
      call: "IncluirPedido",
      app_key: config.app_key,
      app_secret: config.app_secret,
      param: [{
        cabecalho: {
          codigo_cliente: clientResult.codigo_cliente_omie,
          codigo_pedido_integracao: order.id,
          data_previsao: new Date().toISOString().split('T')[0],
          etapa: "10",
          codigo_parcela: "999"
        },
        det: items.map((item: any) => ({
          produto: {
            codigo_produto: item.codigo_produto,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario
          }
        }))
      }]
    }

    console.log('Sending order to Omie:', pedidoOmie)
    const orderResponse = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      body: JSON.stringify(pedidoOmie),
      headers: { 'Content-Type': 'application/json' }
    })

    const orderResult = await orderResponse.json()
    console.log('Order response:', orderResult)

    if (orderResult.faultstring) {
      throw new Error(`Omie API error: ${orderResult.faultstring}`)
    }

    // Atualizar o pedido no Supabase com o código do Omie
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        omie_order_id: orderResult.codigo_pedido,
        omie_status: 'sincronizado',
        omie_last_update: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true, omie_order_id: orderResult.codigo_pedido }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
