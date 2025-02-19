
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
    const requestData = await req.json()
    console.log("Dados brutos recebidos:", JSON.stringify(requestData, null, 2))

    const { orderId, items, shipping_cost, buyer, payment_method, total_amount } = requestData
    console.log("Valor total recebido:", total_amount, typeof total_amount)

    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    if (total_amount === undefined || total_amount === null) {
      throw new Error("Valor total não fornecido")
    }

    // Garantir número com 2 casas decimais
    const amount = Number((Math.round(Number(total_amount) * 100) / 100).toFixed(2))
    console.log("Valor processado:", amount, typeof amount)

    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Valor total inválido: ${total_amount} (processado: ${amount})`)
    }

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    if (payment_method === 'pix') {
      const payment = new Payment(client);

      // Objeto de pagamento simplificado para teste
      const paymentData = {
        transaction_amount: amount,
        description: `Pedido ${orderId}`,
        payment_method_id: "pix",
        payer: {
          email: buyer.email,
        }
      };

      console.log("Dados do pagamento PIX:", JSON.stringify(paymentData, null, 2));
      
      try {
        const headers = {
          'X-Idempotency-Key': orderId
        };

        const result = await payment.create(paymentData, { headers });
        console.log("Resposta PIX:", JSON.stringify(result, null, 2));

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
      } catch (mpError: any) {
        console.error("Erro detalhado do MP:", JSON.stringify(mpError, null, 2));
        throw new Error(`Erro do Mercado Pago: ${mpError.message}`);
      }
    } else {
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
        details: typeof error === 'object' ? JSON.stringify(error) : error.toString(),
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
