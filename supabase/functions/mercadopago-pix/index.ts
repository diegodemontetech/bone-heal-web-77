
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface PixRequest {
  orderId: string;
  amount: number;
  description?: string;
  email?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: PixRequest = await req.json();
    const { orderId, amount, description, email } = body;

    if (!orderId || !amount || amount <= 0) {
      throw new Error("Parâmetros inválidos: orderId e amount são obrigatórios");
    }

    console.log("Criando PIX para pedido:", orderId, "valor:", amount);

    // Usar token fixo para garantir que funcione
    const access_token = "APP_USR-609050106721186-021911-eae43656d661dca581ec088d09694fd5-2268930884";
    
    console.log("Token utilizado (primeiros caracteres):", access_token.substring(0, 10) + "...");

    // Preparar dados para o Mercado Pago API de PIX
    const pixData = {
      transaction_amount: amount,
      description: description || `Pedido #${orderId}`,
      payment_method_id: "pix",
      payer: {
        email: email || "cliente@example.com",
        first_name: "Cliente",
        last_name: "BoneHeal",
        identification: {
          type: "CPF",
          number: "19119119100"
        }
      }
    };

    // Criar pagamento PIX no Mercado Pago
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "X-Idempotency-Key": `pix-${orderId}-${Date.now()}`
      },
      body: JSON.stringify(pixData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API de PIX do Mercado Pago: ${response.status} - ${errorText}`);
      
      // Log the error in the database
      await supabase
        .from('system_logs')
        .insert({
          type: 'mercadopago_pix_error',
          source: 'edge_function',
          status: 'error',
          details: `API Error: ${errorText}`
        });
        
      throw new Error(`Erro na API do Mercado Pago: ${errorText}`);
    }

    // Processar resposta do Mercado Pago
    const data = await response.json();
    console.log("Resposta do Mercado Pago PIX:", JSON.stringify(data, null, 2));

    // Verificar se a resposta contém os dados do PIX
    if (!data.point_of_interaction?.transaction_data?.qr_code) {
      throw new Error("Resposta do Mercado Pago não contém dados do PIX");
    }

    // Registrar o sucesso no log do sistema
    await supabase
      .from('system_logs')
      .insert({
        type: 'mercadopago_pix',
        source: 'edge_function',
        status: 'success',
        details: `PIX gerado para pedido ${orderId}`
      });

    // Atualizar o pedido com os dados do PIX
    await supabase
      .from('orders')
      .update({ 
        mp_payment_id: data.id,
        payment_details: data
      })
      .eq('id', orderId);

    // Extrair os dados importantes do QR code do PIX
    const qrCodeText = data.point_of_interaction.transaction_data.qr_code;
    const qrCodeBase64 = data.point_of_interaction.transaction_data.qr_code_base64;

    // Retornar os dados do PIX
    return new Response(JSON.stringify({
      success: true,
      qr_code: qrCodeText,
      qr_code_text: qrCodeText,
      qr_code_base64: qrCodeBase64,
      payment_id: data.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na geração de PIX do Mercado Pago:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Erro ao processar pagamento via Mercado Pago PIX",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
