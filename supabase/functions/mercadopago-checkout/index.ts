
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, items, shipping_cost, buyer } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer })

    const access_token = Deno.env.get('MP_ACCESS_TOKEN')
    if (!access_token) {
      throw new Error("Token do Mercado Pago não configurado")
    }

    // Validar e formatar os itens
    const preferenceItems = items.map(item => {
      // Garantir que os valores sejam números válidos
      const price = parseFloat(Number(item.price).toFixed(2))
      const quantity = Math.max(1, parseInt(String(item.quantity)))

      if (isNaN(price) || price <= 0) {
        throw new Error(`Preço inválido para o item: ${item.title}`)
      }

      return {
        title: String(item.title || '').substring(0, 256),
        unit_price: price,
        quantity: quantity,
        currency_id: "BRL"
      }
    });

    // Validar e adicionar frete
    let shippingAmount = 0
    if (shipping_cost > 0) {
      shippingAmount = parseFloat(Number(shipping_cost).toFixed(2))
      if (isNaN(shippingAmount)) {
        throw new Error("Valor de frete inválido")
      }

      preferenceItems.push({
        title: "Frete",
        unit_price: shippingAmount,
        quantity: 1,
        currency_id: "BRL"
      });
    }

    // Calcular valor total para validação
    const total = preferenceItems.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity), 0
    )

    if (total <= 0) {
      throw new Error("O valor total do pedido deve ser maior que zero")
    }

    // Preparar a preferência de pagamento
    const preference = {
      items: preferenceItems,
      payer: {
        email: buyer.email,
        name: buyer.name || 'Cliente'
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12
      },
      back_urls: {
        success: `${Deno.env.get('APP_URL')}/checkout/success`,
        failure: `${Deno.env.get('APP_URL')}/checkout/failure`,
        pending: `${Deno.env.get('APP_URL')}/checkout/pending`
      },
      external_reference: orderId,
      auto_return: "approved",
      statement_descriptor: "BONEHEAL",
      expires: false,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`
    }

    console.log("Preferência a ser enviada:", JSON.stringify(preference, null, 2))

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(preference)
      }
    )

    const data = await response.json()
    console.log("Resposta MP:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("Erro detalhado MP:", {
        status: response.status,
        statusText: response.statusText,
        data
      })
      throw new Error(`Erro do Mercado Pago: ${JSON.stringify(data)}`)
    }

    if (!data.init_point) {
      throw new Error("URL de checkout não gerada pelo Mercado Pago")
    }

    console.log("URL de checkout gerada com sucesso:", data.init_point)

    return new Response(
      JSON.stringify({ init_point: data.init_point }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  } catch (error) {
    console.error("Erro detalhado:", {
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
