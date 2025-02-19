
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

    // Validações iniciais
    if (!items?.length) {
      throw new Error("Nenhum item fornecido")
    }

    if (!buyer?.email) {
      throw new Error("Email do comprador não fornecido")
    }

    // Garantir que o valor é um número válido e maior que zero
    const parsedAmount = typeof total_amount === 'string' ? parseFloat(total_amount) : Number(total_amount)
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error(`Valor total inválido: ${total_amount}`)
    }

    // Formatar para duas casas decimais
    const amount = Number(parsedAmount.toFixed(2))
    console.log("Valor a ser processado:", amount)

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!,
    });

    if (payment_method === 'pix') {
      const payment = new Payment(client);
      
      // Criar dados adicionais para o pagamento
      const additional_info = {
        items: items.map(item => ({
          id: item.id,
          title: item.name,
          description: `Pedido ${orderId}`,
          quantity: item.quantity,
          unit_price: Number(item.price),
        })),
        payer: {
          first_name: buyer.name || buyer.email.split('@')[0],
          last_name: '',
          phone: {
            area_code: '',
            number: '',
          },
          address: {
            zip_code: '',
            street_name: '',
            street_number: 0,
          }
        }
      };

      // Preparar dados do pagamento conforme documentação
      const paymentData = {
        transaction_amount: amount,
        description: `Pedido ${orderId}`,
        payment_method_id: 'pix',
        payer: {
          email: buyer.email,
          first_name: buyer.name || buyer.email.split('@')[0],
          identification: {
            type: 'CPF',
            number: '00000000000'
          },
        },
        additional_info,
      };

      // Adicionar header de idempotência
      const headers = {
        'X-Idempotency-Key': orderId,
      };

      console.log("Dados do pagamento PIX:", JSON.stringify(paymentData, null, 2));
      
      try {
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
        console.error("Erro do Mercado Pago:", JSON.stringify(mpError, null, 2));
        throw new Error(`Erro do Mercado Pago: ${mpError.message}`);
      }
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
    console.error("Erro detalhado:", JSON.stringify(error, null, 2));
    
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
