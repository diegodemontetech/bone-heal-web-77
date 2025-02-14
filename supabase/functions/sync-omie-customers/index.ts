
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

async function processarCliente(cliente: any, supabase: any) {
  try {
    if (!cliente.email) {
      console.log(`Pulando cliente ${cliente.codigo_cliente_omie} - email não encontrado`);
      return { status: 'skipped', reason: 'no_email' };
    }

    // Procura usuário existente pelo código Omie
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email:auth_users(email)')
      .eq('omie_code', cliente.codigo_cliente_omie.toString())
      .single();

    if (existingProfile) {
      console.log(`Cliente ${cliente.codigo_cliente_omie} já existe no sistema`);
      return { status: 'exists', id: existingProfile.id };
    }

    // Busca usuário pelo email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users?.find(u => u.email?.toLowerCase() === cliente.email.toLowerCase());

    if (existingUser) {
      // Atualiza o perfil existente com o código Omie
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          omie_code: cliente.codigo_cliente_omie.toString(),
          omie_sync: true,
          cnpj: cliente.cnpj_cpf || null,
          phone: cliente.telefone1_numero || null,
          address: cliente.endereco || null,
          city: cliente.cidade || null,
          state: cliente.estado || null,
          neighborhood: cliente.bairro || null,
          zip_code: cliente.cep || null
        })
        .eq('id', existingUser.id);

      if (updateError) throw updateError;

      console.log(`Perfil atualizado para o cliente ${cliente.codigo_cliente_omie}`);
      return { status: 'updated', id: existingUser.id };
    }

    // Se chegou aqui, é um cliente novo
    const numeroDocumento = (cliente.cnpj_cpf || '').replace(/[^\d]/g, '');
    if (!numeroDocumento) {
      console.log(`Pulando cliente ${cliente.codigo_cliente_omie} - CPF/CNPJ não encontrado`);
      return { status: 'skipped', reason: 'no_document' };
    }

    // Cria novo usuário
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: cliente.email,
      password: numeroDocumento,
      email_confirm: true,
      user_metadata: { 
        full_name: cliente.razao_social,
        omie_code: cliente.codigo_cliente_omie.toString()
      }
    });

    if (createError) {
      console.error(`Erro ao criar usuário ${cliente.email}:`, createError);
      return { status: 'error', error: createError };
    }

    // Atualiza o perfil com dados adicionais do Omie
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        omie_code: cliente.codigo_cliente_omie.toString(),
        omie_sync: true,
        cnpj: cliente.cnpj_cpf || null,
        phone: cliente.telefone1_numero || null,
        address: cliente.endereco || null,
        city: cliente.cidade || null,
        state: cliente.estado || null,
        neighborhood: cliente.bairro || null,
        zip_code: cliente.cep || null
      })
      .eq('id', newUser.user.id);

    if (profileError) throw profileError;

    console.log(`Novo usuário criado para o cliente ${cliente.codigo_cliente_omie}`);
    return { status: 'created', id: newUser.user.id };
  } catch (error) {
    console.error(`Erro ao processar cliente ${cliente.codigo_cliente_omie}:`, error);
    return { status: 'error', error };
  }
}

async function processarLoteDeClientes(clientes: any[], supabase: any, stats: any) {
  for (const cliente of clientes) {
    try {
      const result = await processarCliente(cliente, supabase);
      
      if (result.status === 'created') stats.created++;
      else if (result.status === 'updated') stats.updated++;
      else if (result.status === 'skipped') stats.skipped++;
      else if (result.status === 'error') stats.errors++;
      else if (result.status === 'exists') stats.exists++;

      // Salvamos o progresso após cada cliente
      await supabase
        .from('sync_progress')
        .upsert({ 
          id: 'omie_customers',
          last_processed_code: cliente.codigo_cliente,
          stats: stats,
          updated_at: new Date().toISOString()
        });

    } catch (error) {
      console.error(`Erro ao processar cliente ${cliente.codigo_cliente}:`, error);
      stats.errors++;
    }
    // Pequena pausa entre clientes para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Recupera o progresso anterior
    const { data: progress } = await supabase
      .from('sync_progress')
      .select('*')
      .eq('id', 'omie_customers')
      .single();

    let lastProcessedCode = progress?.last_processed_code || 0;
    let stats = progress?.stats || { created: 0, updated: 0, skipped: 0, errors: 0, exists: 0 };

    console.log('Iniciando/Continuando sincronização a partir do código:', lastProcessedCode);

    const batchSize = 10; // Processa 10 clientes por vez
    let processedInThisRun = 0;
    const maxProcessPerRun = 50; // Limite por execução da função

    // Removendo o filtro e usando apenas paginação
    const listResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call: 'ListarClientesResumido',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [{
          pagina: 1,
          registros_por_pagina: batchSize,
          apenas_importado_api: "N"
        }]
      })
    });

    const listData = await listResponse.json();
    if (listData.faultstring) throw new Error(listData.faultstring);

    const clientes = listData.clientes_cadastro_resumido || [];
    
    // Filtramos manualmente os clientes após o último código processado
    const clientesFiltrados = clientes.filter(c => c.codigo_cliente > lastProcessedCode);
    
    if (clientesFiltrados.length === 0) {
      // Sincronização completa
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Sincronização completa!',
          stats,
          complete: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Busca detalhes completos dos clientes do lote
    const clientesDetalhados = [];
    for (const clienteResumido of clientesFiltrados) {
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
      
      const clienteDetalhado = await detailResponse.json();
      clientesDetalhados.push(clienteDetalhado);
    }

    // Processa o lote atual
    await processarLoteDeClientes(clientesDetalhados, supabase, stats);

    const proximoBatch = clientesFiltrados.length === batchSize;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Lote processado com sucesso: ${stats.created} criados, ${stats.updated} atualizados, ${stats.exists} já existentes, ${stats.skipped} pulados, ${stats.errors} erros`,
        stats,
        complete: !proximoBatch,
        lastProcessedCode: clientesFiltrados[clientesFiltrados.length - 1].codigo_cliente
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
