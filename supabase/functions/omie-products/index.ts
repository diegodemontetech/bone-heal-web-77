
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY');
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
      console.error('Missing Omie credentials');
      throw new Error('Missing Omie credentials');
    }

    console.log('Iniciando busca de produtos no Omie');
    console.log('Usando APP_KEY:', OMIE_APP_KEY.substring(0, 5) + '...');

    const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: 'ListarProdutos',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [{
          pagina: 1,
          registros_por_pagina: 50,
          apenas_importado_api: "N",
          filtrar_apenas_omiepdv: "N"
        }]
      }),
    });

    console.log('Status da resposta Omie:', omieResponse.status);

    if (!omieResponse.ok) {
      const errorText = await omieResponse.text();
      console.error('Erro na resposta do Omie:', omieResponse.status, omieResponse.statusText);
      console.error('Detalhes do erro:', errorText);
      throw new Error(`Erro na API do Omie: ${errorText}`);
    }

    const data = await omieResponse.json();
    console.log('Resposta do Omie recebida');

    if (data.faultstring) {
      console.error('Erro retornado pelo Omie:', data.faultstring);
      throw new Error(data.faultstring);
    }

    // Map Omie products to our format
    const products = data.produto_servico_lista?.map((product: any) => ({
      codigo: product.codigo,
      descricao: product.descricao,
      valor_unitario: product.valor_unitario,
      estoque: product.estoque_atual || 0
    })) || [];

    console.log(`Processados ${products.length} produtos`);
    if (products.length > 0) {
      console.log('Primeiro produto:', JSON.stringify(products[0], null, 2));
    } else {
      console.log('Nenhum produto encontrado no Omie');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        products 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.stack
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
