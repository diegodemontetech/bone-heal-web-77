
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
    let skipped = 0;
    let errors = 0;

    while (hasMorePages) {
      // Primeiro busca a lista resumida
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
      
      // Para cada cliente na lista resumida, busca os detalhes
      for (const clienteResumido of clientes) {
        try {
          // Consulta os detalhes do cliente
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

          // Verifica se o código Omie já está associado a algum perfil
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('omie_code', cliente.codigo_cliente_omie.toString());

          if (existingProfile && existingProfile.length > 0) {
            console.log(`Atualizando ${cliente.codigo_cliente_omie} - código Omie já cadastrado`);
            
            // Atualiza o perfil existente
            const { error: updateError } = await supabase
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
                omie_sync: true,
                contact_type: cliente.tipo_atividade === 'Fornecedor' ? 'supplier' : 
                            cliente.tipo_atividade === 'Cliente/Fornecedor' ? 'both' : 'customer'
              })
              .eq('id', existingProfile[0].id);

            if (updateError) throw updateError;
            skipped++;
            continue;
          }

          // Verifica se já existe um usuário com este email
          const { data: existingUser } = await supabase
            .from('auth_users')
            .select('id')
            .eq('email', cliente.email)
            .single();

          if (existingUser) {
            console.log(`Pulando ${cliente.codigo_cliente_omie} - email já cadastrado: ${cliente.email}`);
            skipped++;
            continue;
          }

          // Gera senha inicial baseada no CPF/CNPJ (apenas números)
          const numeroDocumento = cliente.cnpj_cpf.replace(/[^\d]/g, '');
          if (!numeroDocumento) {
            console.log(`Pulando ${cliente.codigo_cliente_omie} - CPF/CNPJ não encontrado`);
            skipped++;
            continue;
          }

          // Define o tipo de contato baseado na atividade
          let contactType = 'customer';
          if (cliente.tipo_atividade === 'Fornecedor') {
            contactType = 'supplier';
          } else if (cliente.tipo_atividade === 'Cliente/Fornecedor') {
            contactType = 'both';
          }

          // Cria o usuário no Supabase Auth
          const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
            email: cliente.email,
            password: numeroDocumento,
            email_confirm: true,
            user_metadata: {
              full_name: cliente.razao_social,
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
              omie_sync: true,
              contact_type: contactType
            })
            .eq('id', user.id);

          if (profileError) throw profileError;

          created++;
          console.log(`Usuário criado com sucesso para ${cliente.razao_social}`);

          // Aguarda um pouco entre cada criação para evitar sobrecarga
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.error(`Erro ao processar contato:`, error);
          errors++;
        }
      }

      // Verifica se há mais páginas
      hasMorePages = listData.total_de_paginas > page;
      page++;

      // Aguarda entre as páginas para evitar rate limit
      if (hasMorePages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sincronização concluída: ${created} usuários criados, ${skipped} atualizados/pulados, ${errors} erros`,
        totalContatos: created + skipped
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
