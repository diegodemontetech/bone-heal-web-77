
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

    // Simplificar ao máximo os itens
    const preferenceItems = items.map(item => ({
      title: String(item.title || '').substring(0, 256),
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: "BRL"
    }));

    // Adicionar frete como item separado
    if (shipping_cost > 0) {
      preferenceItems.push({
        title: "Frete",
        unit_price: Number(shipping_cost),
        quantity: 1,
        currency_id: "BRL"
      });
    }

    const preference = {
      items: preferenceItems,
      payer: {
        email: buyer.email
      },
      back_urls: {
        success: `${Deno.env.get('APP_URL')}/checkout/success`,
        failure: `${Deno.env.get('APP_URL')}/checkout/failure`
      },
      external_reference: orderId,
      auto_return: "approved"
    }

    console.log("Enviando para MP:", JSON.stringify(preference, null, 2))

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
    console.log("Resposta MP:", data)

    if (!response.ok) {
      throw new Error(`Erro MP: ${JSON.stringify(data)}`)
    }

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
    console.error("Erro:", error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
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
