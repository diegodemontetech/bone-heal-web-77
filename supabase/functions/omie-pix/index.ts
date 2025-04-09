
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, handleCors } from "../_shared/cors.ts"

// Generate a QR code URL for a PIX code
const generateQRCodeImage = (pixCode: string): string => {
  return `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodeURIComponent(pixCode)}`;
};

// Generate a Brazilian PIX code that follows the pattern used by banks
const generatePixCode = (orderId: string, amount: number): string => {
  // Use a fixed amount if none provided, or calculate based on order ID for demo
  const finalAmount = amount > 0 ? amount : Math.floor(100 + (parseInt(orderId.substring(0, 8), 16) % 900)) / 100;
  
  // Create a reasonable transaction ID from order ID
  const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const txId = `${dateStr}${orderId.substring(0, 8).replace(/-/g, '')}`;
  
  // Create a simple PIX code for demo/test purposes that follows the standard pattern
  return `00020101026330014BR.GOV.BCB.PIX01111234567890202${String(finalAmount).length}${finalAmount}5204000053039865802BR5913BoneHeal6008Sao Paulo62070503***6304`;
};

serve(async (req) => {
  console.log(`Processing ${req.method} request to omie-pix`);
  
  // Handle CORS preflight request first
  const corsResponse = handleCors(req);
  if (corsResponse) {
    console.log("Returning CORS preflight response with status 200");
    return corsResponse;
  }
  
  try {
    console.log("=== INÍCIO DA EXECUÇÃO DA FUNÇÃO OMIE-PIX ===");
    
    let requestData;
    
    try {
      requestData = await req.json();
      console.log("Payload recebido:", JSON.stringify(requestData));
    } catch (e) {
      console.error("Erro ao fazer parse do JSON:", e);
      // Return a proper response even when JSON parsing fails
      return new Response(
        JSON.stringify({
          success: false,
          error: "Corpo da requisição inválido. Esperado JSON válido."
        }),
        {
          status: 200, // Use 200 to ensure the error message is returned to the client
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    const { orderId, amount } = requestData;
    
    if (!orderId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "orderId é obrigatório",
          pixCode: generatePixCode("placeholder", amount || 1),
          qr_code_base64: generateQRCodeImage(generatePixCode("placeholder", amount || 1))
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Gerar código PIX
    const pixCode = generatePixCode(orderId, amount);
    const qrCodeImage = generateQRCodeImage(pixCode);
    
    console.log(`PIX gerado com sucesso: ${pixCode.substring(0, 20)}...`);
    
    // Retornar dados do PIX
    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        pixCode,
        qr_code_base64: qrCodeImage,
        amount: amount || 0
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    
    // Generate a safe fallback PIX without using recursion
    const safePixCode = "00020101026330014BR.GOV.BCB.PIX0111123456789020212Pagamento PIX5204000053039865802BR5913BoneHeal6008Sao Paulo62070503***63046CA3";
    const safeQrCodeImage = generateQRCodeImage(safePixCode);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        pixCode: safePixCode,
        qr_code_base64: safeQrCodeImage
      }),
      {
        status: 200, // Retornamos 200 mesmo em caso de erro para que o frontend possa exibir a mensagem
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } finally {
    console.log("=== FIM DA EXECUÇÃO DA FUNÇÃO OMIE-PIX ===");
  }
});
