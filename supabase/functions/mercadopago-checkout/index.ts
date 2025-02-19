
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
    const { orderId, items, shipping_cost, buyer } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer })

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    const preference = new Preference(client);

    // Formatando os itens conforme documentação
    const formattedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "BRL",
      description: `${item.title} - Quantidade: ${item.quantity}`
    }));

    console.log("Itens formatados:", formattedItems);

    const preferenceData = {
      items: formattedItems,
      payer: {
        email: buyer.email,
        name: buyer.name
      },
      shipments: {
        cost: Number(shipping_cost),
        mode: "not_specified"
      },
      back_urls: {
        success: `${Deno.env.get('APP_URL')}/checkout/success`,
        failure: `${Deno.env.get('APP_URL')}/checkout/failure`,
        pending: `${Deno.env.get('APP_URL')}/checkout/pending`
      },
      external_reference: orderId,
      auto_return: "approved",
      statement_descriptor: "Workshop Lovable"
    };

    console.log("Dados da preferência:", preferenceData);

    const result = await preference.create({
      body: preferenceData
    });

    console.log("Resultado da preferência:", result);

    if (!result.init_point) {
      throw new Error("URL de checkout não gerada");
    }

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
    console.error("Erro detalhado na função:", error);
    
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
