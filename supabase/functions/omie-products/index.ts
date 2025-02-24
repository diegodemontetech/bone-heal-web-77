
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
    console.log('Iniciando sincronização de produtos...');
    
    const omieProducts = await listOmieProducts();
    console.log(`Encontrados ${omieProducts.length} produtos no Omie`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const omieProduct of omieProducts) {
      try {
        if (!omieProduct.codigo) {
          console.error('Produto sem código Omie:', omieProduct);
          errorCount++;
          continue;
        }

        // Buscar produto existente pelo código Omie
        const { data: existingProduct, error: findError } = await supabase
          .from('products')
          .select('id, price, active')
          .eq('omie_code', omieProduct.codigo)
          .maybeSingle();

        if (findError) {
          console.error('Erro ao buscar produto:', findError);
          errorCount++;
          continue;
        }

        if (existingProduct) {
          // Convertendo preço do Omie (pode vir como string "319,00" ou número)
          let omiePrice = omieProduct.valor_unitario;
          if (typeof omiePrice === 'string') {
            omiePrice = parseFloat(omiePrice.replace('.', '').replace(',', '.'));
          }

          const isActive = omieProduct.inativo === "N";

          console.log('Verificando produto:', {
            codigo: omieProduct.codigo,
            precoAtual: existingProduct.price,
            precoOmie: omiePrice,
            ativoAtual: existingProduct.active,
            ativoOmie: isActive
          });

          // Só atualiza se houver mudança no preço ou no status
          if (existingProduct.price !== omiePrice || existingProduct.active !== isActive) {
            console.log('Atualizando produto:', omieProduct.codigo);
            
            const { error: updateError } = await supabase
              .from('products')
              .update({
                price: omiePrice,
                active: isActive,
                omie_sync: true,
                omie_last_update: new Date().toISOString()
              })
              .eq('id', existingProduct.id);

            if (updateError) {
              console.error('Erro ao atualizar produto:', updateError);
              errorCount++;
              continue;
            }

            console.log('Produto atualizado com sucesso:', {
              codigo: omieProduct.codigo,
              precoAntigo: existingProduct.price,
              precoNovo: omiePrice,
              ativoAntigo: existingProduct.active,
              ativoNovo: isActive
            });
            updatedCount++;
          } else {
            console.log('Produto já está atualizado:', omieProduct.codigo);
          }
        } else {
          console.log('Produto não encontrado no e-commerce:', omieProduct.codigo);
        }
      } catch (productError) {
        console.error(`Erro ao processar produto ${omieProduct.codigo}:`, productError);
        errorCount++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Sincronização concluída: ${omieProducts.length} produtos processados, ${updatedCount} atualizados, ${errorCount} erros`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

async function listOmieProducts() {
  console.log('Buscando lista de produtos do Omie...');
  
  const response = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      call: "ListarProdutos",
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        pagina: 1,
        registros_por_pagina: 500,
        apenas_importado_api: "N",
        filtrar_apenas_omiepdv: "N"
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos do Omie: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.produtos_cadastro || !Array.isArray(data.produtos_cadastro)) {
    throw new Error('Resposta inválida do Omie');
  }

  return data.produtos_cadastro;
}
