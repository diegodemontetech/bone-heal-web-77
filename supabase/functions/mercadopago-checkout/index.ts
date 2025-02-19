
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

    // Preparar os itens incluindo o desconto, se houver
    let preferenceItems = items.map(item => ({
      title: item.title,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: "BRL",
    }));

    // Se houver desconto, adiciona como um item
    if (discount > 0) {
      preferenceItems.push({
        title: "Desconto",
        unit_price: -Number(discount),
        quantity: 1,
        currency_id: "BRL",
      });
    }

    // Se houver frete, adiciona como um item
    if (shipping_cost > 0) {
      preferenceItems.push({
        title: "Frete",
        unit_price: Number(shipping_cost),
        quantity: 1,
        currency_id: "BRL",
      });
    }

    const preference = {
      items: preferenceItems,
      payer: {
        email: buyer.email,
        name: buyer.name
      },
      payment_methods: {
        excluded_payment_types: [], // Removido a exclusão do boleto para permitir PIX
        installments: 12,
        default_payment_method_id: "pix", // Define PIX como método padrão
      },
      back_urls: {
        success: `${Deno.env.get('APP_URL')}/checkout/success`,
        failure: `${Deno.env.get('APP_URL')}/checkout/failure`,
        pending: `${Deno.env.get('APP_URL')}/checkout/pending`
      },
      external_reference: orderId,
      auto_return: "approved",
      statement_descriptor: "WORKSHOP",
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook` // Adiciona URL de notificação
    }

    console.log("Preferência a ser enviada:", preference)

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

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro do Mercado Pago:", errorData)
      throw new Error(`Erro do Mercado Pago: ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log("Resposta do Mercado Pago:", result)

    return new Response(
      JSON.stringify({
        init_point: result.init_point,
        preference_id: result.id
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
