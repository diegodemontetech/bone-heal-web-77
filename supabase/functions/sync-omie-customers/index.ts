
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

    // Procura cliente existente pelo código Omie
    const { data: existingClient } = await supabase
      .from('clientes_omie')
      .select('id, email, codigo_cliente_omie, user_id')
      .eq('codigo_cliente_omie', cliente.codigo_cliente_omie.toString())
      .single();

    if (existingClient) {
      console.log(`Cliente ${cliente.codigo_cliente_omie} já existe no sistema`);
      
      // Atualiza informações do cliente existente
      const { error: updateError } = await supabase
        .from('clientes_omie')
        .update({ 
          nome_cliente: cliente.razao_social,
          email: cliente.email,
          cnpj_cpf: cliente.cnpj_cpf || null,
          telefone: cliente.telefone1_numero || null,
          endereco: cliente.endereco || null,
          cidade: cliente.cidade || null,
          estado: cliente.estado || null,
          bairro: cliente.bairro || null,
          cep: cliente.cep || null,
          complemento: cliente.complemento || null,
          numero: cliente.endereco_numero || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingClient.id);

      if (updateError) throw updateError;

      // Se o cliente já tem um user_id associado, não precisamos fazer nada mais
      if (existingClient.user_id) {
        return { status: 'updated', id: existingClient.id };
      }

      // Busca usuário pelo email
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find(u => u.email?.toLowerCase() === cliente.email.toLowerCase());

      if (existingUser) {
        // Atualiza o cliente com o user_id encontrado
        const { error: linkError } = await supabase
          .from('clientes_omie')
          .update({ user_id: existingUser.id })
          .eq('id', existingClient.id);

        if (linkError) throw linkError;

        console.log(`Cliente ${cliente.codigo_cliente_omie} vinculado ao usuário existente ${existingUser.id}`);
        return { status: 'linked', id: existingClient.id };
      }

      return { status: 'updated', id: existingClient.id };
    }

    // Se chegou aqui, é um cliente novo
    // Criar novo registro na tabela clientes_omie
    const { data: newCliente, error: createError } = await supabase
      .from('clientes_omie')
      .insert({
        nome_cliente: cliente.razao_social,
        email: cliente.email,
        cnpj_cpf: cliente.cnpj_cpf || null,
        telefone: cliente.telefone1_numero || null,
        endereco: cliente.endereco || null,
        cidade: cliente.cidade || null,
        estado: cliente.estado || null,
        bairro: cliente.bairro || null,
        cep: cliente.cep || null,
        complemento: cliente.complemento || null,
        numero: cliente.endereco_numero || null,
        codigo_cliente_omie: cliente.codigo_cliente_omie.toString()
      })
      .select()
      .single();

    if (createError) {
      console.error(`Erro ao criar cliente ${cliente.codigo_cliente_omie}:`, createError);
      return { status: 'error', error: createError };
    }

    // Busca usuário pelo email para verificar se já existe
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users?.find(u => u.email?.toLowerCase() === cliente.email.toLowerCase());

    if (existingUser) {
      // Atualiza o cliente com o user_id encontrado
      const { error: linkError } = await supabase
        .from('clientes_omie')
        .update({ user_id: existingUser.id })
        .eq('id', newCliente.id);

      if (linkError) throw linkError;

      console.log(`Novo cliente ${cliente.codigo_cliente_omie} vinculado ao usuário existente ${existingUser.id}`);
      return { status: 'created_linked', id: newCliente.id };
    }

    console.log(`Novo cliente criado: ${cliente.codigo_cliente_omie}`);
    return { status: 'created', id: newCliente.id };
  } catch (error) {
    console.error(`Erro ao processar cliente ${cliente.codigo_cliente_omie}:`, error);
    return { status: 'error', error };
  }
}

async function processarLoteDeClientes(clientes: any[], supabase: any, stats: any) {
  for (const cliente of clientes) {
    try {
      const result = await processarCliente(cliente, supabase);
      
      if (result.status === 'created' || result.status === 'created_linked') stats.created++;
      else if (result.status === 'updated' || result.status === 'linked') stats.updated++;
      else if (result.status === 'skipped') stats.skipped++;
      else if (result.status === 'error') stats.errors++;

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
    let stats = progress?.stats || { created: 0, updated: 0, skipped: 0, errors: 0, linked: 0 };

    console.log('Iniciando/Continuando sincronização a partir do código:', lastProcessedCode);

    const batchSize = 10; // Processa 10 clientes por vez
    
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
    console.log('Resposta da API ListarClientesResumido:', listData);
    
    if (listData.faultstring) {
      console.error('Erro da API Omie:', listData.faultstring);
      throw new Error(listData.faultstring);
    }

    const clientes = listData.clientes_cadastro_resumido || [];
    console.log('Total de clientes retornados:', clientes.length);
    
    // Filtramos manualmente os clientes após o último código processado
    const clientesFiltrados = clientes.filter(c => c.codigo_cliente > lastProcessedCode);
    console.log('Clientes filtrados:', clientesFiltrados.length);
    
    if (clientesFiltrados.length === 0) {
      // Sincronização completa
      console.log('Nenhum cliente novo para processar');
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
      try {
        console.log('Buscando detalhes do cliente:', clienteResumido.codigo_cliente);
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
        console.log('Detalhes do cliente recebidos:', clienteResumido.codigo_cliente);
        
        if (clienteDetalhado.faultstring) {
          console.error('Erro ao buscar detalhes do cliente:', clienteDetalhado.faultstring);
          continue;
        }
        
        if (clienteDetalhado.cadastro) {
          clientesDetalhados.push(clienteDetalhado.cadastro);
        } else {
          console.error('Cliente sem dados de cadastro:', clienteResumido.codigo_cliente);
        }
      } catch (error) {
        console.error('Erro ao processar cliente:', clienteResumido.codigo_cliente, error);
        continue;
      }
    }

    console.log('Total de clientes detalhados:', clientesDetalhados.length);

    if (clientesDetalhados.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Nenhum cliente válido para processar neste lote',
          stats
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Processa o lote atual
    await processarLoteDeClientes(clientesDetalhados, supabase, stats);

    const proximoBatch = clientesFiltrados.length === batchSize;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Lote processado com sucesso: ${stats.created} criados, ${stats.updated} atualizados, ${stats.linked} vinculados, ${stats.skipped} pulados, ${stats.errors} erros`,
        stats,
        complete: !proximoBatch,
        lastProcessedCode: clientesFiltrados[clientesFiltrados.length - 1].codigo_cliente
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Erro ao processar a sincronização'
      }),
      { 
        status: 200, // Mudando para 200 para evitar erro na edge function
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
