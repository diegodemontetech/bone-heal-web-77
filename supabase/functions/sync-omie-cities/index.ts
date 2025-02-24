
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REGISTROS_POR_PAGINA = 50;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let pagina = 1;
    let todasCidades: any[] = [];
    let continuar = true;

    while (continuar) {
      console.log(`Fetching page ${pagina}...`);
      
      const response = await fetch('https://app.omie.com.br/api/v1/geral/cidades/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call: "PesquisarCidades",
          app_key: Deno.env.get('OMIE_APP_KEY'),
          app_secret: Deno.env.get('OMIE_APP_SECRET'),
          param: [{
            pagina,
            registros_por_pagina: REGISTROS_POR_PAGINA,
            apenas_importado_api: "N"
          }]
        })
      });

      const data = await response.json();
      console.log(`Got ${data?.cidade_lista?.length || 0} cities from page ${pagina}`);
      
      if (data?.cidade_lista?.length) {
        // Transformar os dados para nosso formato
        const cidadesFormatadas = data.cidade_lista.map((cidade: any) => ({
          omie_code: cidade.codigo,
          name: cidade.nome,
          state: cidade.estado,
          ibge_code: cidade.codigo_ibge
        }));

        // Inserir ou atualizar cidades em lotes
        const { error } = await supabase
          .from('omie_cities')
          .upsert(cidadesFormatadas, {
            onConflict: 'omie_code'
          });

        if (error) {
          console.error('Error upserting cities:', error);
          throw error;
        }

        if (data.cidade_lista.length < REGISTROS_POR_PAGINA) {
          continuar = false;
        } else {
          pagina++;
        }
      } else {
        continuar = false;
      }
    }

    console.log('Finished syncing cities');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cities synchronized successfully' 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: err.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
