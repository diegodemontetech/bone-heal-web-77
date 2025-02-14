
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY');
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function buscarCaracteristicasCliente(codigo_cliente_omie: number) {
  const requestBody = {
    call: 'ConsultarCaractCliente',
    app_key: OMIE_APP_KEY,
    app_secret: OMIE_APP_SECRET,
    param: [{
      codigo_cliente_omie
    }]
  };

  const response = await fetch('https://app.omie.com.br/api/v1/geral/clientescaract/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  return data.caracteristicas || [];
}

async function buscarTagsCliente(codigo_cliente_omie: number) {
  const requestBody = {
    call: 'ListarTags',
    app_key: OMIE_APP_KEY,
    app_secret: OMIE_APP_SECRET,
    param: [{
      nCodCliente: codigo_cliente_omie
    }]
  };

  const response = await fetch('https://app.omie.com.br/api/v1/geral/clientetag/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  return data.tagsLista || [];
}

async function processarCliente(cliente: any, supabase: any) {
  try {
    if (!cliente.email) {
      console.log(`Pulando ${cliente.codigo_cliente_omie} - email não encontrado`);
      return { status: 'skipped' };
    }

    // Busca características e tags do cliente
    const [caracteristicas, tags] = await Promise.all([
      buscarCaracteristicasCliente(cliente.codigo_cliente_omie),
      buscarTagsCliente(cliente.codigo_cliente_omie)
    ]);

    // Procura usuário existente
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('omie_code', cliente.codigo_cliente_omie.toString())
      .maybeSingle();

    let userId;
    if (existingProfile?.id) {
      userId = existingProfile.id;
      console.log(`Usuário encontrado pelo código Omie ${cliente.codigo_cliente_omie}`);
      return { status: 'updated', userId };
    }

    // Busca por email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users?.find(u => u.email?.toLowerCase() === cliente.email.toLowerCase());

    if (existingUser) {
      userId = existingUser.id;
      console.log(`Usuário encontrado pelo email ${cliente.email}`);
      return { status: 'updated', userId };
    }

    // Cria novo usuário
    const numeroDocumento = cliente.cnpj_cpf.replace(/[^\d]/g, '');
    if (!numeroDocumento) {
      console.log(`Pulando ${cliente.codigo_cliente_omie} - CPF/CNPJ não encontrado`);
      return { status: 'skipped' };
    }

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: cliente.email,
      password: numeroDocumento,
      email_confirm: true,
      user_metadata: { full_name: cliente.razao_social }
    });

    if (createError) {
      throw createError;
    }

    userId = newUser.user.id;
    console.log(`Novo usuário criado: ${cliente.email}`);
    return { status: 'created', userId };
  } catch (error) {
    console.error(`Erro ao processar cliente ${cliente.codigo_cliente_omie}:`, error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('Iniciando sincronização de clientes Omie');

    let page = 1;
    const registersPerPage = 50;
    let hasMorePages = true;
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    while (hasMorePages) {
      try {
        const listResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            call: 'ListarClientesResumido',
            app_key: OMIE_APP_KEY,
            app_secret: OMIE_APP_SECRET,
            param: [{
              pagina: page,
              registros_por_pagina: registersPerPage,
              apenas_importado_api: "N"
            }]
          })
        });

        const listData = await listResponse.json();
        if (listData.faultstring) throw new Error(listData.faultstring);

        const clientes = listData.clientes_cadastro_resumido || [];
        console.log(`Processando página ${page} - ${clientes.length} clientes`);

        for (const clienteResumido of clientes) {
          try {
            const detailResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                call: 'ConsultarCliente',
                app_key: OMIE_APP_KEY,
                app_secret: OMIE_APP_SECRET,
                param: [{ codigo_cliente_omie: clienteResumido.codigo_cliente }]
              })
            });

            const cliente = await detailResponse.json();
            const result = await processarCliente(cliente, supabase);

            if (result.status === 'created') created++;
            else if (result.status === 'updated') updated++;
            else if (result.status === 'skipped') skipped++;

            // Aguarda um pouco entre cada cliente para evitar sobrecarga
            await new Promise(resolve => setTimeout(resolve, 500));

          } catch (error) {
            console.error(`Erro ao processar cliente ${clienteResumido.codigo_cliente}:`, error);
            errors++;
          }
        }

        hasMorePages = listData.total_de_paginas > page;
        page++;

        if (hasMorePages) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`Erro ao processar página ${page}:`, error);
        errors++;
        break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${created} criados, ${updated} atualizados, ${skipped} pulados, ${errors} erros`,
        stats: { created, updated, skipped, errors }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
