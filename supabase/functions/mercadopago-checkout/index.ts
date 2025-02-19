
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
    console.log("Dados brutos recebidos:", requestData)

    const { orderId, items, shipping_cost, buyer, payment_method, total_amount } = requestData

    // Validações iniciais
    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    if (total_amount === undefined || total_amount === null) {
      throw new Error("Valor total não fornecido")
    }

    // Garantir que o valor é um número válido
    const amount = Math.round(Number(total_amount) * 100) / 100
    console.log("Valor original:", total_amount)
    console.log("Valor processado:", amount)

    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Valor total inválido: ${total_amount} (processado: ${amount})`)
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

      console.log("Dados do pagamento PIX:", JSON.stringify(paymentData, null, 2));
      const result = await payment.create(paymentData);
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
    
    // Melhorar o formato do erro retornado
    const errorResponse = {
      error: error.message,
      details: typeof error === 'object' ? JSON.stringify(error) : error.toString(),
      raw_error: error,
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
