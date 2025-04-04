
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, items, shipping_cost, payer, payment_method, notification_url, external_reference } = await req.json()
    console.log("Dados recebidos:", { orderId, items, shipping_cost, payer })

    const access_token = Deno.env.get('MP_ACCESS_TOKEN')
    if (!access_token) {
      throw new Error("Token do Mercado Pago não configurado")
    }

    // Validar e formatar os itens
    const preferenceItems = items.map(item => {
      // Garantir que os valores sejam números válidos
      const priceString = typeof item.price === 'string' ? item.price : String(item.price);
      const price = parseFloat(Number(priceString).toFixed(2));
      const quantity = Math.max(1, parseInt(String(item.quantity)));

      if (isNaN(price) || price <= 0) {
        throw new Error(`Preço inválido para o item: ${item.title}. Valor recebido: ${item.price}, convertido para: ${price}`);
      }

      return {
        title: String(item.title || item.name || '').substring(0, 256),
        unit_price: price,
        quantity: quantity,
        currency_id: "BRL"
      }
    });

    // Validar e adicionar frete
    let shippingAmount = 0
    if (shipping_cost > 0) {
      shippingAmount = parseFloat(Number(shipping_cost).toFixed(2))
      if (isNaN(shippingAmount)) {
        throw new Error(`Valor de frete inválido: ${shipping_cost}`)
      }

      preferenceItems.push({
        title: "Frete",
        unit_price: shippingAmount,
        quantity: 1,
        currency_id: "BRL"
      });
    }

    // Calcular valor total para validação
    const total = preferenceItems.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity), 0
    )

    if (total <= 0) {
      throw new Error("O valor total do pedido deve ser maior que zero")
    }

    // Configuração para checkout padrão do MercadoPago
    const app_url = Deno.env.get('APP_URL') || 'https://workshop.lovable.dev'
    
    const config = {
      items: preferenceItems,
      payer: {
        email: payer?.email || "cliente@example.com",
        name: payer?.name || 'Cliente',
        identification: payer?.identification || {
          type: "CPF",
          number: "00000000000"
        }
      },
      external_reference: external_reference || orderId,
      statement_descriptor: "BONEHEAL",
      notification_url: notification_url || `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      back_urls: {
        success: `${app_url}/checkout/success?order_id=${orderId}`,
        failure: `${app_url}/checkout/failure?order_id=${orderId}`,
        pending: `${app_url}/checkout/pending?order_id=${orderId}`
      },
      auto_return: "approved",
      expires: false
    };

    console.log("Preferência a ser enviada:", JSON.stringify(config, null, 2))

    // Chama a API do MercadoPago para criar a preferência
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify(config)
      }
    )

    const data = await response.json()
    console.log("Resposta MP:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("Erro detalhado MP:", {
        status: response.status,
        statusText: response.statusText,
        data
      })
      throw new Error(`Erro do Mercado Pago: ${JSON.stringify(data)}`)
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  } catch (error) {
    console.error("Erro detalhado:", {
      message: error.message,
      stack: error.stack
    })
    
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
    )
  }
})
