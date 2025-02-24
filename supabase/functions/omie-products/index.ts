
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')!;
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const response = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call: "ListarProdutos",
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [{
          pagina: 1,
          registros_por_pagina: 50,
          apenas_importado_api: "N",
          filtrar_apenas_omiepdv: "N"
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Omie: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta do Omie:', data);

    if (!data.produtos_cadastro || !Array.isArray(data.produtos_cadastro)) {
      throw new Error('Formato de resposta inválido do Omie');
    }

    for (const produto of data.produtos_cadastro) {
      console.log('Dados do produto do Omie:', produto);
      
      // Garantir que o preço seja um número
      const precoOmie = typeof produto.valor_unitario === 'string' 
        ? parseFloat(produto.valor_unitario.replace(',', '.'))
        : Number(produto.valor_unitario);

      console.log(`Preço convertido: ${precoOmie}`);

      const { data: produtos, error: selectError } = await supabase
        .from('products')
        .select('*')
        .eq('omie_code', produto.codigo)
        .maybeSingle();

      if (selectError) {
        console.error('Erro ao buscar produto:', selectError);
        continue;
      }

      if (produtos) {
        console.log('Atualizando produto:', {
          codigo: produto.codigo,
          precoAtual: produtos.price,
          precoNovo: precoOmie,
          ativoAtual: produtos.active,
          ativoNovo: produto.inativo === "N"
        });

        const { error: updateError } = await supabase
          .from('products')
          .update({
            price: precoOmie,
            active: produto.inativo === "N",
            omie_sync: true,
            omie_last_update: new Date().toISOString()
          })
          .eq('id', produtos.id);

        if (updateError) {
          console.error('Erro ao atualizar produto:', updateError);
          throw updateError;
        }

        console.log('Produto atualizado com sucesso:', produto.codigo);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Sincronização concluída com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro crítico:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
