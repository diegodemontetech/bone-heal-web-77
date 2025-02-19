
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer })

    // Configurar Mercado Pago
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error("Token do Mercado Pago não configurado")
    }

    console.log("Token MP configurado:", mpAccessToken ? "Sim" : "Não")

    // Por enquanto, vamos apenas retornar uma resposta de sucesso
    return new Response(
      JSON.stringify({
        id: "TEST_" + orderId,
        init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=TEST",
        sandbox_init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=TEST",
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error("Erro detalhado:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        stack: error.stack
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
