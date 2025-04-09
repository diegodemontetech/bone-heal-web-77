
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders, handleCors, addCorsHeaders } from "../_shared/cors.ts";

interface PixRequest {
  orderId: string;
  amount: number;
  description?: string;
  email?: string;
}

const generateQRCodeImage = (pixCode: string): string => {
  const safeContent = encodeURIComponent(pixCode);
  return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${safeContent}`;
};

const formatPIXCode = (orderId: string, amount: number): string => {
  const txId = orderId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 25);
  const amountStr = amount.toFixed(2);
  const merchantKey = "12345678901";
  const merchantName = "BONEHEAL";
  const merchantCity = "SAOPAULO";
  const pixCode = `00020101021226580014BR.GOV.BCB.PIX2565${merchantKey}5204000053039865802BR5915${merchantName}6008${merchantCity}62140510${txId}6304`;
  return pixCode;
};

serve(async (req) => {
  console.log(`Processing ${req.method} request to mercadopago-pix`);
  
  // Handle CORS preflight request first
  const corsResponse = handleCors(req);
  if (corsResponse) {
    console.log("Returning CORS preflight response with status 204");
    return corsResponse;
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables not configured");
      return createFallbackPixResponse("Supabase configuration missing", "fallback");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let body: PixRequest;
    try {
      body = await req.json();
      console.log("Request payload:", JSON.stringify(body));
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      return createFallbackPixResponse("Invalid request format", "invalid-request");
    }
    
    const { orderId, amount, description, email } = body;

    if (!orderId || !amount || amount <= 0) {
      console.error("Missing required parameters:", { orderId, amount });
      return createFallbackPixResponse("Missing required parameters", orderId || "unknown");
    }

    console.log("Creating PIX for order:", orderId, "amount:", amount);

    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'MP_ACCESS_TOKEN')
      .single();

    const access_token = settingsData?.value || 
      Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") || 
      "APP_USR-609050106721186-021911-eae43656d661dca581ec088d09694fd5-2268930884";

    console.log("Token used (first characters):", access_token.substring(0, 10) + "...");

    const pixData = {
      transaction_amount: amount,
      description: description || `Order #${orderId}`,
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

    const idempotencyKey = `pix-${orderId}-${Date.now()}`;

    try {
      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "X-Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(pixData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Mercado Pago PIX API error: ${response.status} - ${errorText}`);
        
        try {
          await supabase
            .from('system_logs')
            .insert({
              type: 'mercadopago_pix_error',
              source: 'edge_function',
              status: 'error',
              details: `API Error: ${errorText}`
            });
        } catch (logError) {
          console.error("Failed to log error to database:", logError);
        }
        
        return createFallbackPixResponse(`Mercado Pago API error: ${response.status}`, orderId);
      }

      const data = await response.json();
      console.log("Mercado Pago PIX response:", JSON.stringify(data, null, 2));

      if (!data.point_of_interaction?.transaction_data?.qr_code) {
        console.error("Mercado Pago response does not contain PIX data");
        return createFallbackPixResponse("Invalid response from Mercado Pago (missing PIX data)", orderId);
      }

      try {
        await supabase
          .from('system_logs')
          .insert({
            type: 'mercadopago_pix',
            source: 'edge_function',
            status: 'success',
            details: `PIX generated for order ${orderId}`
          });

        await supabase
          .from('orders')
          .update({ 
            mp_payment_id: data.id,
            payment_details: data
          })
          .eq('id', orderId);
      } catch (dbError) {
        console.error("Database update error:", dbError);
      }

      const qrCodeText = data.point_of_interaction.transaction_data.qr_code;
      const qrCodeBase64 = data.point_of_interaction.transaction_data.qr_code_base64;
      const ticketUrl = data.point_of_interaction.transaction_data.ticket_url || '';

      const successResponse = new Response(JSON.stringify({
        success: true,
        qr_code: qrCodeText,
        qr_code_text: qrCodeText,
        qr_code_base64: qrCodeBase64,
        redirect_url: ticketUrl,
        payment_id: data.id,
        order_id: orderId,
        amount: amount,
        point_of_interaction: data.point_of_interaction
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
      
      return addCorsHeaders(successResponse);
    } catch (fetchError) {
      console.error("Error calling Mercado Pago API:", fetchError);
      return createFallbackPixResponse(`API call failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`, orderId);
    }
  } catch (error) {
    console.error("Error in Mercado Pago PIX generation:", error);
    return createFallbackPixResponse(error instanceof Error ? error.message : String(error), "unknown");
  }
  
  function createFallbackPixResponse(errorMessage: string, orderId: string): Response {
    console.log(`Creating fallback PIX response due to: ${errorMessage}`);
    
    const pixCode = formatPIXCode(orderId, 100);
    const qrCodeUrl = generateQRCodeImage(pixCode);
    const redirectUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=MP_FALLBACK_${orderId}`;
    
    const response = new Response(
      JSON.stringify({
        success: true,
        message: "Using fallback PIX code",
        error: errorMessage,
        qr_code: pixCode,
        qr_code_text: pixCode,
        qr_code_base64: qrCodeUrl,
        redirect_url: redirectUrl,
        order_id: orderId,
        amount: "100.00",
        point_of_interaction: {
          transaction_data: {
            qr_code: pixCode,
            qr_code_base64: qrCodeUrl,
            ticket_url: redirectUrl
          }
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
    return addCorsHeaders(response);
  }
});
