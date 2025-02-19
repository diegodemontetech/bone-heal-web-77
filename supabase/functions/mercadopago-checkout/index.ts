
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
    console.log("Dados recebidos:", JSON.stringify(requestData, null, 2))

    // Extrair e validar dados
    const { orderId, items, shipping_cost, buyer, payment_method, total_amount } = requestData

    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    if (!total_amount) {
      throw new Error("Valor total não fornecido")
    }

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    if (payment_method === 'pix') {
      const payment = new Payment(client);

      // Criar payload do pagamento
      const paymentPayload = {
        transaction_amount: Number(total_amount),
        description: `Pedido ${orderId}`,
        payment_method_id: "pix",
        payer: {
          email: buyer.email,
          first_name: buyer.name || buyer.email.split('@')[0],
          last_name: "Teste",
          identification: {
            type: "CPF",
            number: "19119119100"
          },
        },
        additional_info: {
          items: items.map(item => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: Number(item.price)
          }))
        }
      };

      console.log("Payload do pagamento:", JSON.stringify(paymentPayload, null, 2));

      try {
        const result = await payment.create(paymentPayload, {
          headers: {
            'X-Idempotency-Key': orderId
          }
        });

        console.log("Resposta do MP:", JSON.stringify(result, null, 2));

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
        console.error("Erro do MP:", mpError);
        throw new Error(mpError.message);
      }
    } else {
      return new Response(
        JSON.stringify({
          amount: total_amount,
          public_key: Deno.env.get('MP_PUBLIC_KEY'),
          description: `Pedido ${orderId}`,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error: any) {
    console.error("Erro na função:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.cause || error.stack || '',
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
