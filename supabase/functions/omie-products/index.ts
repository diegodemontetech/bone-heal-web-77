
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
    
    let atualizados = 0;
    let erros = 0;
    let pagina = 1;
    let totalPaginas = 1;

    do {
      console.log(`Buscando página ${pagina}...`);
      
      const response = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call: "ListarProdutos",
          app_key: OMIE_APP_KEY,
          app_secret: OMIE_APP_SECRET,
          param: [{
            pagina,
            registros_por_pagina: 50,
            apenas_importado_api: "N",
            filtrar_apenas_omiepdv: "N"
          }]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Erro na requisição ao Omie: ${response.status} - ${error}`);
        throw new Error(`Erro na requisição ao Omie: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        console.error('Resposta do Omie não é um objeto válido:', data);
        throw new Error('Resposta inválida do Omie');
      }

      // Atualiza o total de páginas na primeira iteração
      if (pagina === 1) {
        totalPaginas = data.total_de_paginas || 1;
        console.log(`Total de páginas a processar: ${totalPaginas}`);
      }

      if (!data.produto_servico_cadastro || !Array.isArray(data.produto_servico_cadastro)) {
        console.error('Formato de resposta inválido do Omie - produto_servico_cadastro não encontrado ou não é um array');
        throw new Error('Formato de resposta inválido do Omie');
      }

      for (const produto of data.produto_servico_cadastro) {
        try {
          console.log(`Processando produto: ${produto.codigo}`);
          
          if (!produto.codigo || typeof produto.valor_unitario === 'undefined') {
            console.error(`Produto com dados inválidos:`, produto);
            erros++;
            continue;
          }

          // Garante que o valor é um número e converte para formato decimal
          const valorStr = produto.valor_unitario.toString().replace(',', '.');
          const preco = parseFloat(valorStr);
          
          if (isNaN(preco)) {
            console.error(`Erro ao converter preço do produto ${produto.codigo}: ${valorStr}`);
            erros++;
            continue;
          }

          const { data: produtoExistente, error: selectError } = await supabase
            .from('products')
            .select('price, active')
            .eq('omie_code', produto.codigo)
            .maybeSingle();

          if (selectError) {
            console.error(`Erro ao buscar produto ${produto.codigo}:`, selectError);
            erros++;
            continue;
          }

          if (!produtoExistente) {
            console.log(`Produto ${produto.codigo} não encontrado no banco de dados`);
            continue;
          }

          const isAtivo = produto.inativo === "N";
          
          console.log(`Atualizando produto ${produto.codigo}:`, {
            precoAtual: produtoExistente.price,
            precoNovo: preco,
            ativoAtual: produtoExistente.active,
            ativoNovo: isAtivo
          });

          const { error: updateError } = await supabase
            .from('products')
            .update({
              price: preco,
              active: isAtivo,
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
        } catch (error) {
          console.error(`Erro ao processar produto ${produto.codigo}:`, error);
          erros++;
        }
      }

      pagina++;
    } while (pagina <= totalPaginas);

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
