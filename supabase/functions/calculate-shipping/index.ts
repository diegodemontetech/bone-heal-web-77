
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    // Direcionar para a função correios-shipping
    const { data, error } = await callCorreiosShipping(cleanZipCode, body.items || []);
    
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ rates: data, success: true }),
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
    const zipCode = await getZipCodeFromRequest(req);
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
        }
      }
    );
  }
});

async function callCorreiosShipping(zipCode: string, items: any[] = []): Promise<{data?: any[], error?: Error}> {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/correios-shipping`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ zipCode, items })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro na requisição correios-shipping: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Erro ao chamar correios-shipping:', error);
    return { error };
  }
}

async function getZipCodeFromRequest(req: Request): Promise<string> {
  try {
    const body = await req.json();
    return (body.zipCode || body.zipCodeDestination || '00000000').replace(/\D/g, '');
  } catch {
    return '00000000';
  }
}

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
