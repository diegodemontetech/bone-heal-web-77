
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

    console.log('Iniciando sincronização de produtos com o Omie');

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

    const listResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listRequestBody),
    });

    const listData = await listResponse.json();
    
    if (listData.faultstring) {
      throw new Error(`Erro Omie (lista): ${listData.faultstring}`);
    }

    const produtosResumidos = listData.produto_servico_resumido || [];
    console.log(`Produtos encontrados: ${produtosResumidos.length}`);

    let updated = 0;
    let errors = 0;
    let noChanges = 0;

    for (const produtoResumido of produtosResumidos) {
      try {
        console.log('Processando produto:', produtoResumido.codigo);
        
        const detailRequestBody = {
          call: 'ConsultarProduto',
          app_key: OMIE_APP_KEY,
          app_secret: OMIE_APP_SECRET,
          param: [{
            codigo_produto: produtoResumido.codigo_produto,
            codigo_produto_integracao: null
          }]
        };

        const detailResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailRequestBody),
        });

        const detailData = await detailResponse.json();

        if (detailData.faultstring) {
          console.error(`Erro ao consultar produto ${produtoResumido.codigo}:`, detailData.faultstring);
          errors++;
          continue;
        }

        const product = detailData.produto_servico_cadastro;
        
        if (!product || !product.codigo || !product.descricao) {
          console.error('Produto inválido ou sem dados obrigatórios:', detailData);
          errors++;
          continue;
        }

        // Buscar produto existente no Supabase
        const { data: existingProduct } = await supabase
          .from('products')
          .select('*')
          .eq('omie_code', product.codigo)
          .maybeSingle();

        // Tratar o preço do Omie corretamente
        const omiePrice = parseFloat(product.valor_unitario);
        console.log(`Produto ${product.codigo} - Preço atual: ${existingProduct?.price}, Preço Omie: ${omiePrice}`);

        // Construir objeto de atualização
        const updates: Record<string, any> = {
          omie_sync: true,
          omie_last_update: new Date().toISOString(),
          price: omiePrice,
          active: product.inativo !== 'S'
        };

        if (existingProduct) {
          // Comparar preços com precisão de 2 casas decimais
          const currentPrice = Math.round(existingProduct.price * 100) / 100;
          const newPrice = Math.round(omiePrice * 100) / 100;
          const priceChanged = currentPrice !== newPrice;
          const activeChanged = existingProduct.active !== updates.active;

          if (priceChanged || activeChanged) {
            console.log(`Atualizando produto ${product.codigo}:`);
            if (priceChanged) console.log(`- Preço: ${currentPrice} -> ${newPrice}`);
            if (activeChanged) console.log(`- Status: ${existingProduct.active} -> ${updates.active}`);

            const { error } = await supabase
              .from('products')
              .update(updates)
              .eq('id', existingProduct.id);

            if (error) {
              console.error(`Erro ao atualizar produto ${product.codigo}:`, error);
              errors++;
              continue;
            }
            updated++;
          } else {
            noChanges++;
            console.log(`Nenhuma mudança necessária para o produto ${product.codigo}`);
          }
        }
      } catch (error) {
        console.error('Erro ao processar produto:', error);
        errors++;
      }
    }

    const summary = {
      success: true,
      message: `Sincronização concluída: ${updated} produtos atualizados, ${noChanges} sem alterações, ${errors} erros`,
      totalProducts: produtosResumidos.length,
      details: {
        updated,
        noChanges,
        errors,
      }
    };

    console.log('Resumo da sincronização:', summary);

    return new Response(
      JSON.stringify(summary),
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
