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

    console.log('Iniciando busca de clientes no Omie');

    const listRequestBody = {
      call: 'ListarClientes',
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        pagina: 1,
        registros_por_pagina: 50,
        apenas_importado_api: "N",
        clientesFiltro: {
          tipo_atividade: "Consumidor"
        }
      }]
    };

    const listResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listRequestBody),
    });

    const listData = await listResponse.json();
    
    if (listData.faultstring) {
      throw new Error(`Erro Omie: ${listData.faultstring}`);
    }

    const clientes = listData.clientes_cadastro || [];
    console.log(`Clientes encontrados: ${clientes.length}`);

    let created = 0;
    let errors = 0;

    // Processamento em lotes para evitar rate limit
    const BATCH_SIZE = 10;
    const DELAY_BETWEEN_BATCHES = 1000; // 1 segundo de delay entre lotes

    for (let i = 0; i < clientes.length; i += BATCH_SIZE) {
      const batch = clientes.slice(i, i + BATCH_SIZE);
      
      for (const cliente of batch) {
        try {
          // Verifica se é realmente um cliente (dupla verificação)
          if (cliente.tipo_atividade !== 'Consumidor' && cliente.tipo_atividade !== 'Outros') {
            console.log(`Pulando ${cliente.codigo_cliente_omie} pois não é cliente (${cliente.tipo_atividade})`);
            continue;
          }

          // Verifica se o cliente já tem um usuário
          const { data: existingProfiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('omie_code', cliente.codigo_cliente_omie.toString());

          if (existingProfiles && existingProfiles.length > 0) {
            console.log(`Cliente ${cliente.codigo_cliente_omie} já tem usuário`);
            continue;
          }

          // Gera senha inicial baseada no CPF/CNPJ (apenas números)
          const numeroDocumento = cliente.cnpj_cpf.replace(/[^\d]/g, '');
          if (!numeroDocumento) {
            console.log(`Cliente ${cliente.codigo_cliente_omie} não tem CPF/CNPJ`);
            continue;
          }

          // Cria o usuário no Supabase Auth
          const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email: cliente.email,
            password: numeroDocumento,
            options: {
              data: {
                full_name: cliente.razao_social,
              }
            }
          });

          if (signUpError) throw signUpError;
          if (!user?.id) throw new Error('Usuário não foi criado');

          // Atualiza o perfil com os dados do Omie
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: cliente.razao_social,
              cnpj: cliente.pessoa_fisica === 'N' ? cliente.cnpj_cpf : null,
              cpf: cliente.pessoa_fisica === 'S' ? cliente.cnpj_cpf : null,
              address: cliente.endereco,
              city: cliente.cidade,
              state: cliente.estado,
              neighborhood: cliente.bairro,
              phone: cliente.telefone1_numero,
              zip_code: cliente.cep,
              omie_code: cliente.codigo_cliente_omie.toString(),
              omie_sync: true
            })
            .eq('id', user.id);

          if (profileError) throw profileError;

          created++;
          console.log(`Usuário criado com sucesso para ${cliente.razao_social}`);
        } catch (error) {
          console.error(`Erro ao processar cliente ${cliente.codigo_cliente_omie}:`, error);
          errors++;
        }
      }

      // Aguarda antes de processar o próximo lote
      if (i + BATCH_SIZE < clientes.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${created} usuários criados, ${errors} erros`,
        totalClientes: clientes.length
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
