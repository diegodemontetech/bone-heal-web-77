
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import mercadopago from "https://esm.sh/mercadopago@1.5.16"

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

    // Configurar o SDK com o token de acesso
    mercadopago.configure({
      access_token: Deno.env.get('MP_ACCESS_TOKEN')!
    });

    // Formatando os itens conforme documentação
    const formattedItems = items.map(item => ({
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "BRL"
    }));

    console.log("Itens formatados:", formattedItems);

    const preference = {
      items: formattedItems,
      back_urls: {
        success: `${Deno.env.get('APP_URL')}/checkout/success`,
        failure: `${Deno.env.get('APP_URL')}/checkout/failure`,
        pending: `${Deno.env.get('APP_URL')}/checkout/pending`
      },
      external_reference: orderId,
      auto_return: "approved"
    };

    console.log("Dados da preferência:", preference);

    const result = await mercadopago.preferences.create(preference);
    console.log("Resultado da preferência:", result);

    if (!result.body.init_point) {
      throw new Error("URL de checkout não gerada");
    }

    return new Response(
      JSON.stringify({
        init_point: result.body.init_point,
        preference_id: result.body.id
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
