
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Payment, Preference } from "https://esm.sh/mercadopago@2.0.6";

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
    const { orderId, items, shipping_cost, buyer, payment_method, total_amount } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer, payment_method, total_amount })

    // Validar dados recebidos
    if (!items?.length) {
      throw new Error("Nenhum item fornecido");
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido");
    }

    // Configurar Mercado Pago
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error("Token do Mercado Pago não configurado")
    }

    const client = new MercadoPagoConfig({ accessToken: mpAccessToken });
    console.log("MP Client configurado")

    // Garantir que o valor total é um número válido
    const amount = Number(total_amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Valor total inválido: ${total_amount}`);
    }

    console.log("Valor final a ser cobrado:", amount);

    if (payment_method === 'pix') {
      const payment = new Payment(client);
      const result = await payment.create({
        transaction_amount: amount,
        payment_method_id: 'pix',
        payer: {
          email: buyer.email,
        },
        description: `Pedido ${orderId}`,
      });

      console.log("Resposta do MP (PIX):", result);

      return new Response(
        JSON.stringify({
          qr_code: result.point_of_interaction?.transaction_data?.qr_code,
          qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
          payment_id: result.id,
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    } else {
      const preference = new Preference(client);
      const result = await preference.create({
        items: [{
          id: orderId,
          title: `Pedido ${orderId}`,
          quantity: 1,
          unit_price: amount,
          currency_id: 'BRL',
        }],
        payer: {
          email: buyer.email,
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [
            { id: "ticket" },
            { id: "atm" },
          ],
          installments: 12,
        },
        back_urls: {
          success: `${req.headers.get('origin')}/checkout/success`,
          failure: `${req.headers.get('origin')}/checkout/failure`,
        },
        auto_return: "approved",
        external_reference: orderId,
        shipments: {
          cost: shipping_cost,
        },
      });

      console.log("Resposta do MP (Cartão):", result);

      return new Response(
        JSON.stringify({
          init_point: result.init_point,
          sandbox_init_point: result.sandbox_init_point,
          preference_id: result.id,
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }
  } catch (error) {
    console.error("Erro detalhado:", error);
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
