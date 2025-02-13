
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

    // Primeira requisição
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
          registros_por_pagina: 50,
          apenas_importado_api: "N",
          filtrar_apenas_omiepdv: "N",
          inativo: "N"
        }]
      }),
    });

    if (!firstResponse.ok) {
      throw new Error(`HTTP error! status: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();
    console.log('Estrutura da resposta:', Object.keys(firstData));
    
    if (firstData.faultstring) {
      throw new Error(firstData.faultstring);
    }

    let allProducts: any[] = [];
    let totalPages = 1;

    // Verificar se há produtos na primeira página
    if (firstData.produto_servico_lista && Array.isArray(firstData.produto_servico_lista)) {
      console.log(`Encontrados ${firstData.produto_servico_lista.length} produtos na primeira página`);
      allProducts = [...firstData.produto_servico_lista];

      // Calcular total de páginas apenas se houver produtos
      if (firstData.total_de_registros && firstData.registros_por_pagina) {
        totalPages = Math.ceil(firstData.total_de_registros / firstData.registros_por_pagina);
        console.log(`Total de páginas calculado: ${totalPages}`);
      }
    } else {
      console.log('Primeira página não retornou lista de produtos válida');
      console.log('Resposta completa:', JSON.stringify(firstData, null, 2));
    }

    // Buscar páginas adicionais se necessário
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        console.log(`Buscando página ${page} de ${totalPages}`);
        
        const pageResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
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
              registros_por_pagina: 50,
              apenas_importado_api: "N",
              filtrar_apenas_omiepdv: "N",
              inativo: "N"
            }]
          }),
        });

        if (!pageResponse.ok) {
          console.error(`Erro ao buscar página ${page}: ${pageResponse.status}`);
          continue;
        }

        const pageData = await pageResponse.json();
        
        if (pageData.produto_servico_lista && Array.isArray(pageData.produto_servico_lista)) {
          console.log(`Encontrados ${pageData.produto_servico_lista.length} produtos na página ${page}`);
          allProducts = [...allProducts, ...pageData.produto_servico_lista];
        } else {
          console.log(`Página ${page} não retornou lista de produtos válida`);
          console.log('Resposta da página:', JSON.stringify(pageData, null, 2));
        }
      }
    }

    console.log(`Total de produtos coletados: ${allProducts.length}`);

    if (allProducts.length === 0) {
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

    // Log do primeiro produto para debug
    if (allProducts[0]) {
      console.log('Estrutura do primeiro produto:', Object.keys(allProducts[0]));
      console.log('Primeiro produto completo:', JSON.stringify(allProducts[0], null, 2));
    }

    // Mapear produtos para o formato do Supabase
    const products = allProducts.map((product: any) => {
      if (!product.codigo || !product.descricao) {
        console.log('Produto com estrutura inválida:', product);
        return null;
      }

      return {
        omie_code: product.codigo,
        omie_product_id: product.codigo_produto,
        name: product.descricao,
        price: product.valor_unitario ? parseFloat(product.valor_unitario) : 0,
        stock: product.estoque_atual ? parseInt(product.estoque_atual) : 0,
        slug: product.descricao.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        omie_sync: true,
        omie_last_update: new Date().toISOString()
      };
    }).filter(Boolean);

    console.log(`${products.length} produtos válidos para processar`);

    // Atualizar produtos no Supabase
    let updatedCount = 0;
    let insertedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Verificar se o produto já existe
        const { data: existingProduct, error: selectError } = await supabase
          .from('products')
          .select('id, omie_code')
          .eq('omie_code', product.omie_code)
          .maybeSingle();

        if (selectError) {
          console.error('Erro ao buscar produto existente:', selectError);
          errorCount++;
          continue;
        }

        if (existingProduct) {
          // Atualizar produto existente
          const { error: updateError } = await supabase
            .from('products')
            .update(product)
            .eq('id', existingProduct.id);

          if (updateError) {
            console.error('Erro ao atualizar produto:', updateError);
            errorCount++;
          } else {
            updatedCount++;
            console.log(`Produto atualizado: ${product.name}`);
          }
        } else {
          // Inserir novo produto
          const { error: insertError } = await supabase
            .from('products')
            .insert([product]);

          if (insertError) {
            console.error('Erro ao inserir produto:', insertError);
            errorCount++;
          } else {
            insertedCount++;
            console.log(`Novo produto inserido: ${product.name}`);
          }
        }
      } catch (error) {
        console.error('Erro ao processar produto:', error);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sincronização concluída: ${insertedCount} produtos inseridos, ${updatedCount} atualizados, ${errorCount} erros`,
        totalProducts: allProducts.length,
        validProducts: products.length,
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
