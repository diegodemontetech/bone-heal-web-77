import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')!;
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const response = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
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
        }],
      }),
    });

    const data = await response.json();
    
    // Filtrar apenas produtos ativos com estoque disponível
    const availableProducts = data.produto_servico_cadastro
      .filter((product: any) => 
        product.inativo === "N" && 
        product.quantidade_estoque > 0
      )
      .map((product: any) => ({
        id: product.codigo_produto,
        name: product.descricao,
        price: product.valor_unitario,
        stock: product.quantidade_estoque,
      }));

    return new Response(
      JSON.stringify(availableProducts),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Erro na função omie-products:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});