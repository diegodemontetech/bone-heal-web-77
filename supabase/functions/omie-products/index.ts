
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

    const response = await fetch('https://app.omie.com.br/api/v1/produtos/cadastro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: 'ListarProdutosCadastro',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [{
          pagina: 1,
          registros_por_pagina: 50
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta do Omie:', JSON.stringify(data, null, 2));

    if (data.faultstring) {
      throw new Error(`Erro Omie: ${data.faultstring}`);
    }

    const produtos = data.produto_servico_cadastro || [];
    console.log(`Produtos encontrados: ${produtos.length}`);

    if (produtos.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum produto encontrado no Omie',
          products: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mapear produtos
    const products = produtos.map(product => {
      try {
        if (!product.descricao || !product.codigo) {
          console.log('Produto inválido:', product);
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
        totalProducts: produtos.length,
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
