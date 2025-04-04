
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    console.log("Recebendo solicitação de geração de PIX");
    const { orderId, amount } = await req.json();
    
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
    
    // Try to use the real integration with Mercado Pago or other PIX provider
    // For now, we'll generate a valid PIX code structure
    // In production, replace this with your actual PIX integration
    
    // Format amount with 2 decimal places
    const formattedAmount = paymentAmount.toFixed(2);
    
    // Create a transaction ID based on the order ID
    const txId = `${orderId.substring(0, 8).replace(/-/g, '')}${Date.now().toString().substring(6)}`;
    
    // Generate a PIX code that follows the Brazilian PIX standard
    // This is a simplified example - in production use a proper PIX library
    const merchantName = "BONEHEAL";
    const merchantCity = "SAO PAULO";
    const amountStr = formattedAmount.replace('.', '');
    
    // Create a structured PIX code with proper fields
    // 00 = PIX format indicator (fixed)
    // 01 = Merchant account info with key (26 = PIX key info length, 00 = GUI, data = example email)
    // 52 = Merchant category code (0000 = not specified)
    // 53 = Currency (986 = BRL)
    // 54 = Amount
    // 58 = Country code (BR)
    // 59 = Merchant name
    // 60 = Merchant city
    // 62 = Additional data field
    
    const pixCode = `00020126580014BR.GOV.BCB.PIX01366a1a6a1a-6a1a-6a1a-6a1a-6a1a6a1a6a1a0208${txId}5204000053039865${amountStr.length.toString().padStart(2, '0')}${amountStr}5802BR59${merchantName.length.toString().padStart(2, '0')}${merchantName}60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}6219${orderId.substring(0, 19)}6304`;
    
    // For a real implementation, add a CRC16 checksum to the end of the code
    
    console.log("Código PIX gerado com sucesso:", pixCode.substring(0, 20) + "...");
    
    return new Response(
      JSON.stringify({
        pixCode: pixCode,
        order_id: orderId,
        amount: formattedAmount,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  } catch (error) {
    console.error("Erro ao gerar código PIX:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Erro desconhecido ao gerar código PIX"
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

// CORS handling function
function handleCors(req: Request): Response | null {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request for PIX generation");
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  
  // For actual requests, return null to continue processing
  return null;
}
