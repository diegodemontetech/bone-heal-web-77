
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

    // Validação mais rigorosa dos dados
    if (!requestData) {
      throw new Error("Dados não fornecidos")
    }

    const { orderId, items, shipping_cost, buyer, payment_method, total_amount } = requestData

    // Validações mais específicas
    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    // Validação rigorosa do total_amount
    if (total_amount === undefined || total_amount === null) {
      throw new Error("total_amount não pode ser nulo")
    }

    const validAmount = Number(total_amount)
    if (isNaN(validAmount) || validAmount <= 0) {
      throw new Error(`total_amount inválido: ${total_amount}`)
    }

    console.log("Valor total validado:", validAmount)

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    if (payment_method === 'pix') {
      const payment = new Payment(client);

      // Garantir que todos os valores numéricos são Numbers válidos
      const paymentPayload = {
        transaction_amount: validAmount,
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
            title: item.title,
            quantity: Number(item.quantity),
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
          amount: validAmount,
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
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.cause || error.stack || JSON.stringify(error),
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

