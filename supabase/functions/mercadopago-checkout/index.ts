
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Payment } from "https://esm.sh/mercadopago@2.0.6";

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

    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    // Garantir que o valor é um número válido
    const amount = Number(parseFloat(total_amount.toString()).toFixed(2))
    console.log("Valor formatado:", amount)

    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Valor total inválido: ${total_amount}`)
    }

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    if (payment_method === 'pix') {
      const payment = new Payment(client);
      const paymentData = {
        transaction_amount: amount,
        payment_method_id: 'pix',
        payer: {
          email: buyer.email,
        },
        description: `Pedido ${orderId}`,
      };

      console.log("Dados do pagamento PIX:", paymentData);
      const result = await payment.create(paymentData);
      console.log("Resposta PIX:", result);

      return new Response(
        JSON.stringify({
          qr_code: result.point_of_interaction?.transaction_data?.qr_code,
          qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
          payment_id: result.id,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      // Para cartão, retornamos os dados para integração transparente
      return new Response(
        JSON.stringify({
          amount: amount,
          public_key: Deno.env.get('MP_PUBLIC_KEY'),
          description: `Pedido ${orderId}`,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    console.error("Erro detalhado:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
