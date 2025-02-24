
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
    
    // Buscar produtos do Omie
    const omieProducts = await listOmieProducts();
    console.log(`Encontrados ${omieProducts.length} produtos no Omie`);

    // Processar cada produto
    for (const omieProduct of omieProducts) {
      try {
        console.log(`\nProcessando produto Omie: ${omieProduct.codigo}`, omieProduct);
        
        const productData = {
          name: omieProduct.descricao,
          price: parseFloat(omieProduct.valor_unitario),
          omie_code: omieProduct.codigo,
          active: omieProduct.inativo === "N",
          omie_sync: true,
          omie_last_update: new Date().toISOString(),
        };

        console.log('Dados preparados para atualização:', productData);

        // Verificar se o produto já existe
        const { data: existingProduct, error: findError } = await supabase
          .from('products')
          .select('*')
          .eq('omie_code', omieProduct.codigo)
          .maybeSingle();

        if (findError) {
          console.error('Erro ao buscar produto existente:', findError);
          continue;
        }

        if (existingProduct) {
          console.log('Atualizando produto existente:', existingProduct.id);
          
          const { error: updateError } = await supabase
            .from('products')
            .update({
              price: productData.price,
              active: productData.active,
              omie_sync: true,
              omie_last_update: new Date().toISOString()
            })
            .eq('id', existingProduct.id);

          if (updateError) {
            console.error('Erro ao atualizar produto:', updateError);
            continue;
          }

          console.log('Produto atualizado com sucesso:', {
            id: existingProduct.id,
            omie_code: productData.omie_code,
            price: productData.price,
            active: productData.active
          });
        } else {
          // Criar slug a partir do nome
          const slug = productData.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

          console.log('Criando novo produto com slug:', slug);

          const { error: insertError } = await supabase
            .from('products')
            .insert({
              ...productData,
              slug
            });

          if (insertError) {
            console.error('Erro ao criar produto:', insertError);
            continue;
          }

          console.log('Novo produto criado:', {
            omie_code: productData.omie_code,
            price: productData.price,
            active: productData.active
          });
        }
      } catch (productError) {
        console.error(`Erro ao processar produto ${omieProduct.codigo}:`, productError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Sincronização concluída: ${omieProducts.length} produtos processados`
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
  console.log('Resposta do Omie:', data);

  if (!data.produtos_cadastro || !Array.isArray(data.produtos_cadastro)) {
    console.error('Resposta inválida do Omie:', data);
    throw new Error('Formato de resposta inválido do Omie');
  }

  return data.produtos_cadastro;
}
