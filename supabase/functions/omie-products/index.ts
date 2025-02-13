
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY');
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Iniciando busca de produtos no Omie');

    // Fazer requisição para a API do Omie
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
          filtrar_apenas_omiepdv: "N",
          inativo: "N"  // Adicionado para buscar apenas produtos ativos
        }]
      }),
    });

    if (!omieResponse.ok) {
      console.error('Erro na resposta do Omie:', omieResponse.status);
      throw new Error(`HTTP error! status: ${omieResponse.status}`);
    }

    const data = await omieResponse.json();
    console.log('Resposta do Omie:', JSON.stringify(data, null, 2));

    if (data.faultstring) {
      console.error('Erro retornado pelo Omie:', data.faultstring);
      throw new Error(data.faultstring);
    }

    // Verificar se temos produtos na resposta
    if (!data.produto_servico_lista || data.produto_servico_lista.length === 0) {
      console.log('Nenhum produto encontrado no Omie');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum produto encontrado no Omie',
          products: [] 
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }

    const products = data.produto_servico_lista.map((product: any) => ({
      omie_code: product.codigo,
      omie_product_id: product.codigo_produto,
      name: product.descricao,
      price: parseFloat(product.valor_unitario),
      stock: parseInt(product.estoque_atual || '0'),
      slug: product.descricao.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      omie_sync: true,
      omie_last_update: new Date().toISOString()
    }));

    console.log(`Processando ${products.length} produtos do Omie`);

    // Atualizar produtos no Supabase
    for (const product of products) {
      // Verificar se o produto já existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, omie_code')
        .eq('omie_code', product.omie_code)
        .maybeSingle();

      if (existingProduct) {
        // Atualizar produto existente
        const { error: updateError } = await supabase
          .from('products')
          .update(product)
          .eq('id', existingProduct.id);

        if (updateError) {
          console.error('Erro ao atualizar produto:', updateError);
          continue;
        }
        console.log(`Produto atualizado: ${product.name}`);
      } else {
        // Inserir novo produto
        const { error: insertError } = await supabase
          .from('products')
          .insert([product]);

        if (insertError) {
          console.error('Erro ao inserir produto:', insertError);
          continue;
        }
        console.log(`Novo produto inserido: ${product.name}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${products.length} produtos sincronizados com sucesso`,
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
    console.error('Erro na sincronização:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
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
