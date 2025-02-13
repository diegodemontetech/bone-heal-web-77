
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

    console.log('Iniciando busca de contatos no Omie');

    let page = 1;
    const registersPerPage = 50;
    let hasMorePages = true;
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    while (hasMorePages) {
      const listRequestBody = {
        call: 'ListarClientesResumido',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [{
          pagina: page,
          registros_por_pagina: registersPerPage,
          apenas_importado_api: "N"
        }]
      };

      console.log(`Buscando página ${page}...`);

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

      const clientes = listData.clientes_cadastro_resumido || [];
      
      for (const clienteResumido of clientes) {
        try {
          const consultaRequestBody = {
            call: 'ConsultarCliente',
            app_key: OMIE_APP_KEY,
            app_secret: OMIE_APP_SECRET,
            param: [{
              codigo_cliente_omie: clienteResumido.codigo_cliente
            }]
          };

          const consultaResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(consultaRequestBody),
          });

          const cliente = await consultaResponse.json();

          if (!cliente.email) {
            console.log(`Pulando ${cliente.codigo_cliente_omie} - email não encontrado`);
            skipped++;
            continue;
          }

          // Busca o usuário pelo email usando auth.users
          const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
          const existingUser = users.users.find(u => u.email === cliente.email);

          let userId;

          if (existingUser) {
            console.log(`Atualizando usuário existente: ${cliente.email}`);
            userId = existingUser.id;
            updated++;
          } else {
            // Se não existe, cria um novo usuário
            const numeroDocumento = cliente.cnpj_cpf.replace(/[^\d]/g, '');
            if (!numeroDocumento) {
              console.log(`Pulando ${cliente.codigo_cliente_omie} - CPF/CNPJ não encontrado`);
              skipped++;
              continue;
            }

            const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
              email: cliente.email,
              password: numeroDocumento,
              email_confirm: true,
              user_metadata: {
                full_name: cliente.razao_social,
              }
            });

            if (signUpError) {
              if (signUpError.message.includes('already been registered')) {
                console.log(`Usuário já existe, pulando criação: ${cliente.email}`);
                const { data: existingUserData } = await supabase.auth.admin.getUserById(existingUser?.id || '');
                userId = existingUserData?.user?.id;
                if (!userId) {
                  errors++;
                  continue;
                }
                updated++;
              } else {
                console.error(`Erro ao criar usuário para ${cliente.email}:`, signUpError);
                errors++;
                continue;
              }
            } else {
              userId = user?.id;
              if (!userId) {
                console.error(`Usuário não foi criado para ${cliente.email}`);
                errors++;
                continue;
              }
              created++;
            }
          }

          // Define o tipo de contato
          let contactType = 'customer';
          if (cliente.tipo_atividade === 'Fornecedor') {
            contactType = 'supplier';
          } else if (cliente.tipo_atividade === 'Cliente/Fornecedor') {
            contactType = 'both';
          }

          const profileData = {
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
            omie_sync: true,
            contact_type: contactType
          };

          // Upsert do perfil (atualiza se existe, cria se não existe)
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({ 
              ...profileData, 
              id: userId 
            });

          if (upsertError) {
            console.error(`Erro ao atualizar/criar perfil para ${cliente.email}:`, upsertError);
            errors++;
            continue;
          }

          console.log(`Processado com sucesso: ${cliente.razao_social}`);
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.error(`Erro ao processar contato:`, error);
          errors++;
        }
      }

      hasMorePages = listData.total_de_paginas > page;
      page++;

      if (hasMorePages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${created} usuários criados, ${updated} atualizados, ${skipped} pulados, ${errors} erros`,
        stats: {
          created,
          updated,
          skipped,
          errors
        }
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
