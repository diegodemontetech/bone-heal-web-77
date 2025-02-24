
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
          continue;
        }

        const product = detailData.produto_servico_cadastro;
        
        if (!product) {
          console.log('Produto inválido:', detailData);
          continue;
        }

        // Buscar produto existente no Supabase
        const { data: existingProduct } = await supabase
          .from('products')
          .select('*')
          .eq('omie_code', product.codigo)
          .maybeSingle();

        if (existingProduct) {
          // Atualizar apenas preço e status se necessário
          const updates: Record<string, any> = {
            omie_sync: true,
            omie_last_update: new Date().toISOString()
          };

          // Atualizar preço se diferente
          if (existingProduct.price !== parseFloat(product.valor_unitario)) {
            updates.price = parseFloat(product.valor_unitario);
          }

          // Atualizar status ativo baseado no status do Omie
          const isActiveInOmie = product.inativo !== 'S';
          if (existingProduct.active !== isActiveInOmie) {
            updates.active = isActiveInOmie;
          }

          // Só atualiza se houver mudanças
          if (Object.keys(updates).length > 1) { // > 1 porque sempre teremos omie_sync e omie_last_update
            const { error } = await supabase
              .from('products')
              .update(updates)
              .eq('id', existingProduct.id);

            if (error) throw error;
            updated++;
          }
        }
      } catch (error) {
        console.error('Erro ao processar produto:', error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${updated} produtos atualizados, ${errors} erros`,
        totalProducts: produtosResumidos.length
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
