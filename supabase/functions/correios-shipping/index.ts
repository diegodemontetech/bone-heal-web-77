
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CORREIOS_TOKEN = Deno.env.get('CORREIOS_TOKEN');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCodeDestination } = await req.json();

    // Mapeamento de faixas de CEP para estados
    const cepToState: { [key: string]: string } = {
      '01000000': 'SP', '20000000': 'RJ', '29000000': 'ES', '30000000': 'MG',
      '40000000': 'BA', '49000000': 'SE', '50000000': 'PE', '53000000': 'PE',
      '57000000': 'AL', '58000000': 'PB', '59000000': 'RN', '60000000': 'CE',
      '64000000': 'PI', '65000000': 'MA', '66000000': 'PA', '69000000': 'AM',
      '69300000': 'RR', '69900000': 'AC', '70000000': 'DF', '72800000': 'GO',
      '76800000': 'RO', '77000000': 'TO', '78000000': 'MT', '79000000': 'MS',
      '80000000': 'PR', '88000000': 'SC', '90000000': 'RS', '96000000': 'RS'
    };

    // Encontrar o estado baseado no CEP
    const cep = parseInt(zipCodeDestination);
    let state = 'SP'; // Estado padrão

    for (const [rangeCep, stateCode] of Object.entries(cepToState)) {
      if (cep >= parseInt(rangeCep)) {
        state = stateCode;
      }
    }

    console.log(`CEP ${zipCodeDestination} mapped to state: ${state}`);

    return new Response(
      JSON.stringify({ state }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in correios-shipping function:', error);
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
