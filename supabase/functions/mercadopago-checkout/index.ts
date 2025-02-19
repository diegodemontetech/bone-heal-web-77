
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
// @ts-ignore
import mercadopago from "https://esm.sh/mercadopago@1.5.16"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obter dados do request
    const { orderId, items, shipping_cost, buyer } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer })

    // Configurar Mercado Pago
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error("Token do Mercado Pago não configurado")
    }

    mercadopago.configure({
      access_token: mpAccessToken
    })

    console.log("Criando preferência...")

    // Criar preferência
    const preference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: Number(item.unit_price)
      })),
      shipments: {
        cost: Number(shipping_cost),
        mode: "not_specified",
      },
      back_urls: {
        success: `${req.headers.get("origin")}/checkout/success`,
        failure: `${req.headers.get("origin")}/checkout/failure`,
        pending: `${req.headers.get("origin")}/checkout/pending`
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      payer: {
        name: buyer.name,
        email: buyer.email
      }
    }

    console.log("Preferência criada:", preference)

    // Criar preferência no Mercado Pago
    const response = await mercadopago.preferences.create(preference)
    console.log("Resposta MP:", response)

    // Retornar resposta
    return new Response(
      JSON.stringify(response.body),
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
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
