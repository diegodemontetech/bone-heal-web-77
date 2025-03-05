
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Aceitamos tanto zipCode quanto zipCodeDestination para compatibilidade
    const zipCode = body.zipCode || body.zipCodeDestination;

    if (!zipCode) {
      throw new Error("CEP não informado");
    }

    console.log(`Calculando frete para CEP: ${zipCode}`);
    
    // Cálculo simplificado baseado apenas no CEP
    const cep = parseInt(zipCode);
    const baseRate = 25 + (cep % 10);
    
    // Simular diferentes opções de frete
    const shippingRates = [
      {
        service_type: "PAC",
        name: "PAC",
        rate: baseRate,
        delivery_days: 7,
        zipCode: zipCode
      },
      {
        service_type: "SEDEX",
        name: "SEDEX",
        rate: baseRate * 1.5,
        delivery_days: 3,
        zipCode: zipCode
      }
    ];

    console.log("Taxas de frete calculadas:", shippingRates);

    return new Response(
      JSON.stringify(shippingRates),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Erro na função correios-shipping:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
