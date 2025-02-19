
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Payment, Preference } from "https://esm.sh/mercadopago@2.0.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, items, shipping_cost, buyer, payment_method, total_amount } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, buyer, payment_method, total_amount })

    // Validar dados básicos
    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    // Garantir que o valor é um número e está no formato certo
    const amount = parseFloat(total_amount.toString()).toFixed(2)
    console.log("Valor formatado:", amount)

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error(`Valor total inválido: ${total_amount}`)
    }

    // Configurar cliente do MP
    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    if (payment_method === 'pix') {
      const payment = new Payment(client);
      const paymentData = {
        transaction_amount: Number(amount),
        payment_method_id: 'pix',
        payer: {
          email: buyer.email,
        },
        description: `Pedido ${orderId}`,
      };

      console.log("Dados do pagamento PIX:", paymentData);
      const result = await payment.create(paymentData);
      console.log("Resposta PIX:", result);

      if (!result.point_of_interaction?.transaction_data?.qr_code) {
        throw new Error("QR Code não gerado pelo Mercado Pago");
      }

      return new Response(
        JSON.stringify({
          qr_code: result.point_of_interaction.transaction_data.qr_code,
          qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
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
      const preferenceData = {
        items: [{
          id: orderId,
          title: `Pedido ${orderId}`,
          quantity: 1,
          unit_price: Number(amount),
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
      };

      console.log("Dados da preferência:", preferenceData);
      const result = await preference.create(preferenceData);
      console.log("Resposta preferência:", result);

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
        details: JSON.stringify(error),
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
