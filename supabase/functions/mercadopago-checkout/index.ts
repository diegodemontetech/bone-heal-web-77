
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
    const { orderId, items, shipping_cost, discount, buyer, total_amount } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, discount, buyer, total_amount })

    const access_token = Deno.env.get('MP_ACCESS_TOKEN')
    if (!access_token) {
      throw new Error("Token do Mercado Pago não configurado")
    }

    // Garantir que os valores estejam no formato correto
    const preferenceItems = items.map(item => ({
      id: item.id,
      title: String(item.title || '').slice(0, 256), // Limitar tamanho do título
      description: `Quantidade: ${item.quantity}`,
      unit_price: Number(Number(item.price).toFixed(2)), // Arredondar para 2 casas decimais
      quantity: Math.max(1, Number(item.quantity)),
      currency_id: "BRL",
    }));

    // Certificar que temos pelo menos um item
    if (preferenceItems.length === 0) {
      throw new Error("Pedido deve ter pelo menos um item")
    }

    let totalItemsAmount = preferenceItems.reduce((acc, item) => 
      acc + (item.unit_price * item.quantity), 0
    );

    // Adiciona frete como item se houver
    if (shipping_cost > 0) {
      preferenceItems.push({
        title: "Frete",
        description: "Taxa de entrega",
        unit_price: Number(Number(shipping_cost).toFixed(2)),
        quantity: 1,
        currency_id: "BRL",
      });
      totalItemsAmount += shipping_cost;
    }

    // Adiciona desconto como item negativo se houver
    if (discount > 0) {
      const discountValue = Math.min(discount, totalItemsAmount);
      preferenceItems.push({
        title: "Desconto",
        description: "Desconto aplicado",
        unit_price: -Number(Number(discountValue).toFixed(2)),
        quantity: 1,
        currency_id: "BRL",
      });
    }

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
      statement_descriptor: "WORKSHOP",
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`
    }

    console.log("Preferência a ser enviada:", JSON.stringify(preference, null, 2))

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(preference),
      }
    )

    const responseData = await response.json()
    console.log("Resposta do Mercado Pago:", responseData)

    if (!response.ok) {
      throw new Error(`Erro do Mercado Pago: ${JSON.stringify(responseData)}`)
    }

    return new Response(
      JSON.stringify({
        init_point: responseData.init_point,
        preference_id: responseData.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  } catch (error) {
    console.error("Erro detalhado na função:", error)
    
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
