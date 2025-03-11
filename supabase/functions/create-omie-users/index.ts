
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function criarUsuariosOmie() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const stats = { created: 0, skipped: 0, errors: 0, updated: 0 };

  try {
    // Primeiro, encontrar todos os CNPJs/CPFs exclusivos na tabela pedidos_omie
    const { data: clientesComPedidos, error: pedidosError } = await supabase
      .from('pedidos_omie')
      .select('cnpj_cpf')
      .not('cnpj_cpf', 'is', null);

    if (pedidosError) {
      throw new Error(`Erro ao buscar pedidos: ${pedidosError.message}`);
    }

    console.log(`Encontrados ${clientesComPedidos?.length || 0} CPFs/CNPJs únicos em pedidos`);
    
    // Criar um Set para busca rápida
    const cnpjsComPedidos = new Set(clientesComPedidos.map(p => p.cnpj_cpf));
    
    // Buscar clientes que têm pedidos
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes_omie')
      .select(`
        id, 
        nome_cliente, 
        email, 
        cnpj_cpf, 
        telefone, 
        endereco, 
        numero, 
        complemento, 
        bairro, 
        cidade, 
        estado, 
        cep, 
        codigo_cliente_omie, 
        user_id
      `)
      .is('user_id', null)
      .not('email', 'is', null)
      .not('email', 'eq', '');

    if (clientesError) {
      throw new Error(`Erro ao buscar clientes: ${clientesError.message}`);
    }

    console.log(`Encontrados ${clientes?.length || 0} clientes sem usuário associado`);

    // Processar todos os clientes, mesmo os que não têm pedidos
    for (const cliente of clientes || []) {
      try {
        // Verificar se o cliente tem pedidos
        const temPedidos = cnpjsComPedidos.has(cliente.cnpj_cpf);
        if (!temPedidos) {
          console.log(`Cliente ${cliente.nome_cliente} (${cliente.cnpj_cpf}) sem pedidos, mas será criado mesmo assim`);
        }

        // Verificar se o email é válido
        if (!cliente.email || !cliente.email.match(/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
          console.log(`Cliente ${cliente.nome_cliente} com email inválido: ${cliente.email}, pulando...`);
          stats.skipped++;
          continue;
        }

        // Verificar se já existe um usuário com este email
        const { data: existingUser } = await supabase.auth.admin.listUsers();
        const userWithEmail = existingUser.users.find(u => u.email?.toLowerCase() === cliente.email.toLowerCase());
        
        if (userWithEmail) {
          console.log(`Usuário com email ${cliente.email} já existe, atualizando relação...`);
          
          // Atualizar o user_id no cliente
          await supabase
            .from('clientes_omie')
            .update({ user_id: userWithEmail.id })
            .eq('id', cliente.id);
            
          // Atualizar cliente_id nos pedidos
          await supabase
            .from('pedidos_omie')
            .update({ cliente_id: cliente.id })
            .eq('cnpj_cpf', cliente.cnpj_cpf);
            
          stats.updated++;
          continue;
        }

        // Gerar senha padrão (números do CPF/CNPJ)
        let senha = (cliente.cnpj_cpf || '').replace(/[^\d]/g, '');
        if (!senha || senha.length < 6) {
          senha = '123456'; // Senha padrão
        }

        // Criar novo usuário
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: cliente.email,
          password: senha,
          email_confirm: true,
          user_metadata: {
            full_name: cliente.nome_cliente,
            phone: cliente.telefone,
            address: cliente.endereco,
            city: cliente.cidade,
            state: cliente.estado,
            zip_code: cliente.cep,
            cnpj: cliente.cnpj_cpf,
            neighborhood: cliente.bairro,
            complemento: cliente.complemento,
            endereco_numero: cliente.numero,
            role: 'dentist',
            omie_code: cliente.codigo_cliente_omie
          }
        });

        if (createError) {
          console.error(`Erro ao criar usuário para ${cliente.email}:`, createError);
          stats.errors++;
          continue;
        }

        console.log(`Usuário criado com sucesso: ${cliente.email}`);

        // Atualizar o user_id no cliente
        await supabase
          .from('clientes_omie')
          .update({ user_id: newUser.user.id })
          .eq('id', cliente.id);
          
        // Atualizar cliente_id nos pedidos
        await supabase
          .from('pedidos_omie')
          .update({ cliente_id: cliente.id })
          .eq('cnpj_cpf', cliente.cnpj_cpf);

        stats.created++;
      } catch (clienteError) {
        console.error(`Erro ao processar cliente ${cliente.nome_cliente}:`, clienteError);
        stats.errors++;
      }
      
      // Pequeno delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return stats;
  } catch (error) {
    console.error('Erro ao processar clientes Omie:', error);
    return { ...stats, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'POST') {
      const result = await criarUsuariosOmie();
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Sincronização concluída! ${result.created} usuários criados, ${result.updated} atualizados, ${result.skipped} pulados, ${result.errors} erros.`,
          stats: result
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    throw new Error('Método não suportado');
  } catch (error) {
    console.error('Erro na função:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
