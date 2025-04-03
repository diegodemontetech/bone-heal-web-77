
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const reqData = await req.json();
    const { orderId, items, shipping_cost, discount, payment_method, payer, notification_url, external_reference, expiration_date_to } = reqData;
    
    console.log("Dados recebidos:", reqData);

    const access_token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!access_token) {
      throw new Error("Token do Mercado Pago não configurado");
    }

    // Validar e formatar os itens
    const preferenceItems = items.map((item: any) => {
      // Garantir que os valores sejam números válidos
      const price = parseFloat(Number(item.unit_price || item.price).toFixed(2));
      const quantity = Math.max(1, parseInt(String(item.quantity)));

      if (isNaN(price) || price <= 0) {
        throw new Error(`Preço inválido para o item: ${item.title || item.name}`);
      }

      return {
        title: String(item.title || item.name || '').substring(0, 256),
        unit_price: price,
        quantity: quantity,
        currency_id: "BRL"
      }
    });

    // Validar e adicionar frete
    let shippingAmount = 0;
    if (shipping_cost > 0) {
      shippingAmount = parseFloat(Number(shipping_cost).toFixed(2));
      if (isNaN(shippingAmount)) {
        throw new Error("Valor de frete inválido");
      }

      preferenceItems.push({
        title: "Frete",
        unit_price: shippingAmount,
        quantity: 1,
        currency_id: "BRL"
      });
    }

    // Aplicar desconto se necessário
    if (discount && discount > 0) {
      const discountAmount = parseFloat(Number(discount).toFixed(2));
      if (!isNaN(discountAmount) && discountAmount > 0) {
        preferenceItems.push({
          title: "Desconto",
          unit_price: -discountAmount, // Valor negativo para desconto
          quantity: 1,
          currency_id: "BRL"
        });
      }
    }

    // Calcular valor total para validação
    const total = preferenceItems.reduce((sum: number, item: any) => 
      sum + (item.unit_price * item.quantity), 0
    );

    if (total <= 0) {
      throw new Error("O valor total do pedido deve ser maior que zero");
    }

    // Configuração para checkout padrão do MercadoPago
    const app_url = Deno.env.get('APP_URL') || 'https://workshop.lovable.dev';
    
    // Configurar dados padrão para o pagamento
    const currentDate = new Date();
    const thirtyMinutesFromNow = new Date(currentDate.getTime() + 30 * 60 * 1000);
    const expirationDate = expiration_date_to || thirtyMinutesFromNow.toISOString();
    
    let config: any = {
      transaction_amount: total,
      description: `Pedido #${orderId.substring(0, 8)}`,
      payment_method_id: "pix",
      payer: payer || {
        email: "cliente@example.com",
        first_name: 'Cliente',
        identification: {
          type: "CPF",
          number: "00000000000"
        }
      },
      external_reference: external_reference || orderId,
      notification_url: notification_url || `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`
    };

    console.log("Configuração a ser enviada:", JSON.stringify(config, null, 2));

    // Para PIX, usamos a API de pagamentos em vez da API de preferências
    const response = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(config)
      }
    );

    const data = await response.json();
    console.log("Resposta MP:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Erro detalhado MP:", {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(`Erro do Mercado Pago: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  } catch (error) {
    console.error("Erro detalhado:", {
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
