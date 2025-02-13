
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

    // Primeira requisição para obter total de páginas
    const firstResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
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
          registros_por_pagina: 50
        }]
      }),
    });

    if (!firstResponse.ok) {
      throw new Error(`HTTP error! status: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();
    console.log('Primeira resposta:', JSON.stringify(firstData, null, 2));

    if (firstData.faultstring) {
      throw new Error(firstData.faultstring);
    }

    let allProducts: any[] = [];
    let totalPages = 1;

    if (firstData.total_de_paginas) {
      totalPages = firstData.total_de_paginas;
      console.log(`Total de páginas: ${totalPages}`);
    }

    // Adicionar produtos da primeira página
    if (firstData.produto_servico_lista && Array.isArray(firstData.produto_servico_lista)) {
      allProducts = [...firstData.produto_servico_lista];
      console.log(`Produtos na primeira página: ${firstData.produto_servico_lista.length}`);
    }

    // Buscar páginas adicionais se houver
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        console.log(`Buscando página ${page}`);
        
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
              pagina: page,
              registros_por_pagina: 50
            }]
          }),
        });

        if (!response.ok) {
          console.error(`Erro na página ${page}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.produto_servico_lista && Array.isArray(data.produto_servico_lista)) {
          allProducts = [...allProducts, ...data.produto_servico_lista];
          console.log(`Produtos na página ${page}: ${data.produto_servico_lista.length}`);
        }
      }
    }

    if (allProducts.length === 0) {
      console.log('Nenhum produto encontrado');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum produto encontrado no Omie',
          products: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Total de produtos encontrados: ${allProducts.length}`);

    // Mapear produtos para o formato do Supabase
    const products = allProducts.map(product => {
      try {
        if (!product.descricao || !product.codigo) {
          console.log('Produto com dados incompletos:', product);
          return null;
        }

        return {
          name: product.descricao,
          omie_code: product.codigo,
          omie_product_id: product.codigo_produto,
          price: product.valor_unitario ? parseFloat(product.valor_unitario) : 0,
          stock: product.quantidade_estoque ? parseInt(product.quantidade_estoque) : 0,
          slug: product.descricao.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          omie_sync: true,
          omie_last_update: new Date().toISOString()
        };
      } catch (error) {
        console.error('Erro ao processar produto:', error);
        return null;
      }
    }).filter(Boolean);

    console.log(`Produtos válidos: ${products.length}`);

    // Processar produtos no Supabase
    let updated = 0;
    let inserted = 0;
    let errors = 0;

    for (const product of products) {
      try {
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('omie_code', product.omie_code)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('products')
            .update(product)
            .eq('id', existing.id);

          if (error) {
            console.error('Erro ao atualizar:', error);
            errors++;
          } else {
            updated++;
          }
        } else {
          const { error } = await supabase
            .from('products')
            .insert([product]);

          if (error) {
            console.error('Erro ao inserir:', error);
            errors++;
          } else {
            inserted++;
          }
        }
      } catch (error) {
        console.error('Erro ao processar:', error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${inserted} produtos inseridos, ${updated} atualizados, ${errors} erros`,
        totalProducts: allProducts.length,
        validProducts: products.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
