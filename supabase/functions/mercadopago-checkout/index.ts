
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const mercadopago = require("mercadopago");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId, items, shipping_cost, buyer } = await req.json()
    
    console.log("Recebido pedido:", { orderId, items, shipping_cost, buyer });

    // Configurar credenciais
    mercadopago.configure({
      access_token: Deno.env.get('MP_ACCESS_TOKEN')
    });

    console.log("Criando preferência de pagamento...");

    const preference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "BRL"
      })),
      shipments: {
        cost: shipping_cost,
        mode: "not_specified",
      },
      back_urls: {
        success: `${req.headers.get("origin")}/checkout/success?order_id=${orderId}`,
        failure: `${req.headers.get("origin")}/checkout/failure?order_id=${orderId}`,
        pending: `${req.headers.get("origin")}/checkout/pending?order_id=${orderId}`
      },
      auto_return: "approved",
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      external_reference: orderId,
      payer: {
        name: buyer.name,
        email: buyer.email
      }
    };

    console.log("Preferência criada:", preference);

    const response = await mercadopago.preferences.create(preference);
    console.log("Resposta do Mercado Pago:", response);

    return new Response(
      JSON.stringify(response.body),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    )
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    )
  }
})
