
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Adiciona o console log detalhado para depuração
serve(async (req) => {
  console.log("=== INÍCIO DA EXECUÇÃO DA FUNÇÃO PIX ===");
  console.log("Método da requisição:", req.method);
  console.log("Headers:", JSON.stringify(Object.fromEntries([...req.headers.entries()])));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Recebido pedido OPTIONS, respondendo com CORS headers");
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    console.log("Recebendo solicitação de geração de PIX");
    
    const body = await req.text();
    console.log("Corpo da requisição recebido:", body);
    
    const data = JSON.parse(body);
    console.log("Dados após parse:", JSON.stringify(data));
    
    const { orderId, amount } = data;
    
    if (!orderId) {
      throw new Error("ID do pedido não fornecido");
    }
    
    // Ensure amount is a valid number
    const paymentAmount = typeof amount === 'number' ? amount : 
                         parseFloat(String(amount));
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      throw new Error(`Valor inválido para pagamento: ${amount}`);
    }
    
    console.log(`Gerando PIX para pedido: ${orderId}, valor: ${paymentAmount}`);
    
    // Verificar e registrar o token do Mercado Pago disponível
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
    console.log("Token do MP disponível:", mpAccessToken ? "Sim (primeiro 5 chars: " + mpAccessToken.substring(0, 5) + ")" : "Não");
    
    if (!mpAccessToken) {
      console.error("ERRO: Token do Mercado Pago não está definido nas variáveis de ambiente");
      throw new Error("Configuração incompleta: Token do Mercado Pago não disponível");
    }
    
    console.log("Usando API do Mercado Pago para gerar PIX");
    
    // Preparar requisição para o Mercado Pago
    const mpPaymentData = {
      transaction_amount: paymentAmount,
      description: `Pedido #${orderId}`,
      payment_method_id: "pix",
      payer: {
        email: "cliente@boneheal.com.br",
        first_name: "Cliente",
        last_name: "Boneheal"
      }
    };
    
    console.log("Dados para API do Mercado Pago:", JSON.stringify(mpPaymentData));
    
    // Chamar API do Mercado Pago
    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mpAccessToken}`
      },
      body: JSON.stringify(mpPaymentData)
    });
    
    console.log("Status da resposta MP:", mpResponse.status);
    
    const responseBody = await mpResponse.text();
    console.log("Corpo da resposta MP:", responseBody);
    
    if (mpResponse.ok) {
      const mpData = JSON.parse(responseBody);
      console.log("PIX Mercado Pago gerado com sucesso", mpData.id);
      
      // Extrair dados do PIX
      const pixData = mpData.point_of_interaction?.transaction_data;
      console.log("Dados da transação PIX:", pixData ? JSON.stringify(pixData) : "Não disponível");
      
      if (pixData?.qr_code) {
        return new Response(
          JSON.stringify({
            pixCode: pixData.qr_code,
            qr_code_base64: pixData.qr_code_base64,
            payment_id: mpData.id,
            order_id: orderId,
            amount: paymentAmount,
            point_of_interaction: mpData.point_of_interaction
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          }
        );
      } else {
        console.error("Resposta do MP não contém código QR PIX");
        throw new Error("Resposta do Mercado Pago não contém código QR PIX");
      }
    } else {
      console.error("Erro na API do Mercado Pago:", responseBody);
      throw new Error(`Erro ao gerar PIX via Mercado Pago: ${responseBody}`);
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Erro desconhecido ao gerar código PIX",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  } finally {
    console.log("=== FIM DA EXECUÇÃO DA FUNÇÃO PIX ===");
  }
});
