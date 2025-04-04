
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight request first
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body = await req.json();
    const zipCode = body.zipCode || body.zipCodeDestination;
    
    console.log(`Calculando frete para CEP: ${zipCode}`);
    
    // Validação básica do CEP
    if (!zipCode) {
      throw new Error("CEP não informado");
    }
    
    // Limpar o CEP para ter apenas números
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      throw new Error("CEP inválido: deve conter 8 dígitos");
    }

    // Generate fallback rates directly without calling correios-shipping
    const fallbackRates = generateFallbackRates(cleanZipCode);

    return new Response(
      JSON.stringify({ rates: fallbackRates, success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Erro na função calculate-shipping:', error);
    
    // Gerar taxas de frete padrão em caso de erro
    let zipCode;
    try {
      const bodyData = await req.json();
      zipCode = (bodyData.zipCode || bodyData.zipCodeDestination || "00000000").replace(/\D/g, '');
    } catch {
      zipCode = "00000000";
    }
    
    const fallbackRates = generateFallbackRates(zipCode);
    
    return new Response(
      JSON.stringify({ 
        rates: fallbackRates, 
        success: true, 
        error: error.message, 
        message: "Usando taxas de frete padrão devido a um erro" 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  }
});

function generateFallbackRates(zipCode: string): any[] {
  const zipPrefix = zipCode.substring(0, 3);
  let baseFee = 25;
  let days = 7;
  
  // Adjust shipping based on region (simplified version)
  if (['010', '011', '012', '013', '014', '015'].includes(zipPrefix)) {
    // São Paulo capital
    baseFee = 20;
    days = 3;
  } else if (parseInt(zipPrefix) >= 10 && parseInt(zipPrefix) <= 199) {
    // São Paulo state
    baseFee = 25;
    days = 4;
  }
  
  return [
    {
      id: "sedex",
      service_type: "Sedex",
      name: "Sedex - Entrega Rápida",
      rate: baseFee + 5,
      delivery_days: Math.max(2, days - 3),
      zipCode
    },
    {
      id: "pac",
      service_type: "PAC",
      name: "PAC - Entrega Econômica",
      rate: baseFee,
      delivery_days: days,
      zipCode
    }
  ];
}
