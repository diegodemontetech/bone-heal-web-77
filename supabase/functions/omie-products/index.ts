
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
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Iniciando busca de produtos no Omie');
    console.log('Usando as credenciais:', { OMIE_APP_KEY, OMIE_APP_SECRET });

    // Primeiro, vamos listar os produtos de forma resumida
    const listRequestBody = {
      call: 'ListarProdutosResumido',
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        pagina: 1,
        registros_por_pagina: 50,
        apenas_importado_api: "N",
        filtrar_apenas_omiepdv: "N"
      }]
    };

    console.log('Request body (list):', JSON.stringify(listRequestBody, null, 2));

    const listResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listRequestBody),
    });

    // Log da resposta bruta para debug
    const listResponseText = await listResponse.text();
    console.log('Lista response (raw):', listResponseText);
    
    let listData;
    try {
      listData = JSON.parse(listResponseText);
    } catch (error) {
      console.error('Erro ao parsear resposta da lista:', error);
      throw new Error(`Erro ao parsear resposta da API: ${listResponseText}`);
    }

    console.log('Lista response (parsed):', JSON.stringify(listData, null, 2));

    if (listData.faultstring) {
      throw new Error(`Erro Omie (lista): ${listData.faultstring}`);
    }

    // Verificar todos os campos da resposta
    console.log('Campos da resposta:', Object.keys(listData));
    
    const produtosResumidos = listData.produto_servico_resumido || [];
    console.log(`Produtos encontrados: ${produtosResumidos.length}`);

    if (produtosResumidos.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum produto encontrado no Omie',
          products: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Agora vamos buscar os detalhes de cada produto
    const products = [];
    for (const produtoResumido of produtosResumidos) {
      try {
        console.log('Processando produto resumido:', produtoResumido);
        
        const detailRequestBody = {
          call: 'ConsultarProduto',
          app_key: OMIE_APP_KEY,
          app_secret: OMIE_APP_SECRET,
          param: [{
            codigo_produto: produtoResumido.codigo_produto,
            codigo_produto_integracao: null
          }]
        };

        console.log('Request body (detail):', JSON.stringify(detailRequestBody, null, 2));

        const detailResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(detailRequestBody),
        });

        // Log da resposta bruta para debug
        const detailResponseText = await detailResponse.text();
        console.log('Detail response (raw):', detailResponseText);
        
        let detailData;
        try {
          detailData = JSON.parse(detailResponseText);
        } catch (error) {
          console.error('Erro ao parsear resposta do detalhe:', error);
          continue;
        }

        console.log('Detail response (parsed):', JSON.stringify(detailData, null, 2));

        if (detailData.faultstring) {
          console.error(`Erro ao consultar produto ${produtoResumido.codigo}:`, detailData.faultstring);
          continue;
        }

        // Se o produto vier dentro de um objeto, extrair
        const product = detailData.produto_servico_cadastro || detailData;
        
        if (!product.descricao || !product.codigo) {
          console.log('Produto inválido:', product);
          continue;
        }

        // Pegar a primeira URL de imagem se existir
        const imageUrl = product.imagens && product.imagens[0] ? product.imagens[0].url_imagem : null;

        products.push({
          name: product.descricao,
          omie_code: product.codigo,
          omie_product_id: product.codigo_produto.toString(),
          price: product.valor_unitario ? parseFloat(product.valor_unitario) : 0,
          stock: product.quantidade_estoque ? parseInt(product.quantidade_estoque) : 0,
          slug: product.descricao.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          main_image: imageUrl,
          omie_sync: true,
          omie_last_update: new Date().toISOString()
        });
      } catch (error) {
        console.error('Erro ao processar produto:', error);
      }
    }

    console.log(`Produtos válidos: ${products.length}`);

    // Atualizar no Supabase
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

          if (error) throw error;
          updated++;
        } else {
          const { error } = await supabase
            .from('products')
            .insert([product]);

          if (error) throw error;
          inserted++;
        }
      } catch (error) {
        console.error('Erro ao processar produto no Supabase:', error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${inserted} produtos inseridos, ${updated} atualizados, ${errors} erros`,
        totalProducts: produtosResumidos.length,
        validProducts: products.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
