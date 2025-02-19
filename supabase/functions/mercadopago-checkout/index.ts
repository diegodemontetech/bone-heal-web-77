
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Preference } from "https://esm.sh/mercadopago@2.0.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, items, shipping_cost, buyer, total_amount } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer, total_amount })

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    const preference = new Preference(client);

    const preferenceData = {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        currency_id: "BRL"
      })),
      payer: {
        email: buyer.email,
        name: buyer.name
      },
      shipments: {
        cost: shipping_cost
      },
      back_urls: {
        success: `${Deno.env.get('APP_URL')}/checkout/success`,
        failure: `${Deno.env.get('APP_URL')}/checkout/failure`,
      },
      external_reference: orderId,
      auto_return: "approved",
    };

    console.log("Preference data:", preferenceData);

    const result = await preference.create(preferenceData);
    console.log("Preference result:", result);

    return new Response(
      JSON.stringify({
        init_point: result.init_point,
        preference_id: result.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error("Erro na função:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
