
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
    console.log('Iniciando sincronização com Omie...');
    
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
      throw new Error(`Erro na requisição ao Omie: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta do Omie:', JSON.stringify(data, null, 2));

    if (!data.produtos_cadastro || !Array.isArray(data.produtos_cadastro)) {
      throw new Error('Formato de resposta inválido do Omie');
    }

    let atualizados = 0;
    let erros = 0;

    for (const produto of data.produtos_cadastro) {
      try {
        console.log(`Processando produto: ${produto.codigo} - ${produto.descricao}`);
        
        // Converte o preço para número, removendo formatação
        const precoStr = produto.valor_unitario.toString().replace(',', '.');
        const preco = parseFloat(precoStr);
        
        if (isNaN(preco)) {
          console.error(`Erro ao converter preço para o produto ${produto.codigo}: ${produto.valor_unitario}`);
          erros++;
          continue;
        }

        const { data: produtoExistente, error: selectError } = await supabase
          .from('products')
          .select('*')
          .eq('omie_code', produto.codigo)
          .maybeSingle();

        if (selectError) {
          console.error(`Erro ao buscar produto ${produto.codigo}:`, selectError);
          erros++;
          continue;
        }

        if (produtoExistente) {
          console.log(`Atualizando produto ${produto.codigo}:`, {
            precoAtual: produtoExistente.price,
            precoNovo: preco,
            ativoAtual: produtoExistente.active,
            ativoNovo: produto.inativo === "N"
          });

          const { error: updateError } = await supabase
            .from('products')
            .update({
              price: preco,
              active: produto.inativo === "N",
              omie_sync: true,
              omie_last_update: new Date().toISOString()
            })
            .eq('omie_code', produto.codigo);

          if (updateError) {
            console.error(`Erro ao atualizar produto ${produto.codigo}:`, updateError);
            erros++;
            continue;
          }

          atualizados++;
          console.log(`Produto ${produto.codigo} atualizado com sucesso`);
        }
      } catch (error) {
        console.error(`Erro ao processar produto ${produto.codigo}:`, error);
        erros++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Sincronização concluída. ${atualizados} produtos atualizados. ${erros} erros encontrados.`,
      stats: { atualizados, erros }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro crítico na sincronização:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
