
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import MercadoPago from 'https://esm.sh/mercadopago@1.5.16'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, items, shipping_cost, buyer } = await req.json()

    if (!orderId || !items || !buyer) {
      throw new Error("Dados incompletos para criar preferência de pagamento")
    }

    console.log("Criando preferência para pedido:", orderId)

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

    console.log("Preferência configurada:", preference)

    const response = await mercadopago.preferences.create(preference)

    console.log("Preferência criada com sucesso:", response.body.id)
    
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
    console.error('Erro ao criar preferência:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao processar pagamento' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
