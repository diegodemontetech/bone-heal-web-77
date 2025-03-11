
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratar solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Inicializar cliente Supabase para verificação de permissões
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Autenticar usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Usuário não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar se o usuário tem permissão para gerenciar integrações
    const { data: permissions, error: permError } = await supabaseClient
      .from('user_permissions')
      .select('permission')
      .eq('user_id', user.id)
      .eq('permission', 'manage_integrations');
    
    if (permError || !permissions || permissions.length === 0) {
      return new Response(JSON.stringify({ error: 'Sem permissão para gerenciar integrações' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Processar dados da requisição
    const { secrets } = await req.json();
    
    if (!secrets || typeof secrets !== 'object') {
      return new Response(JSON.stringify({ error: 'Formato de dados inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // URL da API Admin do Supabase
    const projectRef = Deno.env.get('SUPABASE_PROJECT_ID') || 'kurpshcdafxbyqnzxvxu';
    const apiKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // API para atualizar secrets
    const secretsUrl = `https://api.supabase.com/v1/projects/${projectRef}/secrets`;
    
    // Formatar secrets para o formato esperado pela API
    const secretsArray = Object.entries(secrets).map(([name, value]) => ({
      name,
      value: String(value)
    }));
    
    console.log(`Atualizando ${secretsArray.length} secretos`);
    
    // Enviar para a API do Supabase
    const response = await fetch(secretsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(secretsArray)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao atualizar secretos: ${errorText}`);
      throw new Error(`Erro na API do Supabase: ${response.status} ${errorText}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Secretos atualizados com sucesso' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Erro na função:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: `Erro ao atualizar secretos: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
