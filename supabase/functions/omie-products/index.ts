import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.fresh.run/std@v9.6.1/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY') || '';
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando sincronização de produtos com Omie');

    // Buscar produtos não sincronizados
    const { data: products, error: fetchError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('omie_sync', false);

    if (fetchError) throw fetchError;

    console.log(`Encontrados ${products?.length || 0} produtos para sincronizar`);

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Nenhum produto para sincronizar' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sincronizar cada produto
    const results = await Promise.all(products.map(async (product) => {
      const omieProduct = {
        codigo_produto_integracao: product.id,
        codigo: product.id,
        descricao: product.name,
        valor_unitario: product.price || 0,
        unidade: "UN",
        ncm: "90211010", // NCM para produtos odontológicos
        origem_produto: 0, // 0 = Nacional
        peso_liq: 0.5, // Peso líquido padrão
        peso_bruto: 0.6, // Peso bruto padrão
        altura: 10, // Altura em centímetros
        largura: 10, // Largura em centímetros
        comprimento: 10, // Comprimento em centímetros
        descricao_detalhada: product.description || product.short_description || '',
      };

      const response = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call: 'IncluirProduto',
          app_key: OMIE_APP_KEY,
          app_secret: OMIE_APP_SECRET,
          param: [omieProduct],
        }),
      });

      const omieData = await response.json();

      if (omieData.faultstring) {
        console.error(`Erro ao sincronizar produto ${product.id}:`, omieData.faultstring);
        throw new Error(omieData.faultstring);
      }

      // Atualizar produto com código do Omie
      const { error: updateError } = await supabaseClient
        .from('products')
        .update({
          omie_code: omieData.codigo_produto,
          omie_sync: true,
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      return {
        product_id: product.id,
        omie_code: omieData.codigo_produto,
        success: true,
      };
    }));

    console.log('Sincronização concluída com sucesso');

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro durante a sincronização:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});