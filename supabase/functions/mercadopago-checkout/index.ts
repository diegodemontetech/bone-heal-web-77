
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import MercadoPago from 'https://esm.sh/mercadopago@1.5.16'

const handler = async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, items, shipping_cost, buyer } = await req.json()

    // Configurar MercadoPago
    const mercadopago = new MercadoPago(Deno.env.get('MP_ACCESS_TOKEN'))

    // Criar preferência para checkout transparente
    const preference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        currency_id: 'BRL',
      })),
      payer: {
        email: buyer.email,
        name: buyer.name,
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      shipments: {
        cost: shipping_cost,
        mode: "not_specified",
      },
      back_urls: {
        success: `${req.headers.get("origin")}/checkout/success?order_id=${orderId}`,
        failure: `${req.headers.get("origin")}/checkout/failure?order_id=${orderId}`,
        pending: `${req.headers.get("origin")}/checkout/pending?order_id=${orderId}`,
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${req.headers.get("origin")}/api/mercadopago-webhook`,
    }

    const response = await mercadopago.preferences.create(preference)
    
    return new Response(
      JSON.stringify({
        id: response.body.id,
        init_point: response.body.init_point,
        sandbox_init_point: response.body.sandbox_init_point,
        public_key: Deno.env.get('MP_PUBLIC_KEY'),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
}

serve(handler)
