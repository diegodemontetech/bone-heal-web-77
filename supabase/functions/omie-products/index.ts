
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

    let allProducts: any[] = [];
    let currentPage = 1;
    let totalPages = 1;

    // Primeira requisição para obter o total de páginas
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
          pagina: currentPage,
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
    console.log('Resposta completa da primeira página:', JSON.stringify(firstData, null, 2));
    
    if (firstData.faultstring) {
      throw new Error(firstData.faultstring);
    }

    // Calcular total de páginas
    totalPages = Math.ceil(firstData.total_de_registros / firstData.registros);
    console.log(`Total de registros: ${firstData.total_de_registros}, Total de páginas: ${totalPages}`);

    // Adicionar produtos da primeira página
    if (firstData.produto_servico_lista && firstData.produto_servico_lista.length > 0) {
      console.log('Produtos da primeira página:', JSON.stringify(firstData.produto_servico_lista, null, 2));
      allProducts = [...firstData.produto_servico_lista];
      console.log(`Adicionados ${firstData.produto_servico_lista.length} produtos da página 1`);
    } else {
      console.log('Primeira página não contém produtos. Estrutura da resposta:', Object.keys(firstData));
    }

    // Buscar as páginas restantes
    for (currentPage = 2; currentPage <= totalPages; currentPage++) {
      console.log(`Buscando página ${currentPage} de ${totalPages}...`);
      
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
            pagina: currentPage,
            registros_por_pagina: 50,
            apenas_importado_api: "N",
            filtrar_apenas_omiepdv: "N",
            inativo: "N"
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Resposta da página ${currentPage}:`, JSON.stringify(data, null, 2));
      
      if (data.faultstring) {
        throw new Error(data.faultstring);
      }

      if (data.produto_servico_lista && data.produto_servico_lista.length > 0) {
        allProducts = [...allProducts, ...data.produto_servico_lista];
        console.log(`Adicionados ${data.produto_servico_lista.length} produtos da página ${currentPage}`);
      } else {
        console.log(`Página ${currentPage} não contém produtos. Estrutura da resposta:`, Object.keys(data));
      }
    }

    console.log(`Total de produtos encontrados: ${allProducts.length}`);
    if (allProducts.length > 0) {
      console.log('Exemplo do primeiro produto:', JSON.stringify(allProducts[0], null, 2));
    }

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

    // Mapear produtos para o formato do Supabase
    const products = allProducts.map((product: any) => ({
      omie_code: product.codigo,
      omie_product_id: product.codigo_produto,
      name: product.descricao,
      price: parseFloat(product.valor_unitario),
      stock: parseInt(product.estoque_atual || '0'),
      slug: product.descricao.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      omie_sync: true,
      omie_last_update: new Date().toISOString()
    }));

    console.log(`Processando ${products.length} produtos do Omie para inserção/atualização`);
    console.log('Exemplo do primeiro produto processado:', JSON.stringify(products[0], null, 2));

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
