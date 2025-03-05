
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
    const items = body.items || [];
    
    // Validação do CEP
    if (!zipCode || zipCode.length !== 8) {
      throw new Error("CEP inválido");
    }

    console.log(`Calculando frete para CEP: ${zipCode}`);
    
    // Calcular peso total dos itens (se disponível)
    let totalWeight = 0;
    if (items.length > 0) {
      totalWeight = items.reduce((acc, item) => acc + ((item.weight || 0.5) * item.quantity), 0);
    } else {
      // Peso padrão se não houver itens
      totalWeight = 0.5;
    }
    
    // Cálculo simplificado baseado no CEP e peso
    const cepPrefix = parseInt(zipCode.substring(0, 3));
    const baseRate = 15 + (cepPrefix % 30);
    const weightFactor = Math.max(1, totalWeight);
    
    // Simular diferentes opções de frete
    const shippingRates = [
      {
        service_type: "PAC",
        name: "PAC",
        rate: Math.round(baseRate * weightFactor * 100) / 100,
        delivery_days: 7,
        zipCode: zipCode
      },
      {
        service_type: "SEDEX",
        name: "SEDEX",
        rate: Math.round(baseRate * weightFactor * 1.5 * 100) / 100,
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
