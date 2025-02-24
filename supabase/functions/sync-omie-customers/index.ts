
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get profiles that haven't been synced with Omie yet
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('omie_sync', false)
      .is('omie_code', null);

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No profiles to sync' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const omieAppKey = Deno.env.get('OMIE_APP_KEY')!;
    const omieAppSecret = Deno.env.get('OMIE_APP_SECRET')!;

    for (const profile of profiles) {
      try {
        console.log(`Iniciando sincronização do cliente: ${profile.full_name}`);

        // Prepare customer data for Omie
        const customerData = {
          call: 'IncluirCliente',
          app_key: omieAppKey,
          app_secret: omieAppSecret,
          param: [{
            codigo_cliente_integracao: profile.id,
            email: profile.email,
            razao_social: profile.pessoa_fisica ? profile.full_name : profile.razao_social,
            nome_fantasia: profile.pessoa_fisica ? profile.full_name : profile.nome_fantasia,
            cnpj_cpf: profile.pessoa_fisica ? profile.cpf : profile.cnpj,
            telefone1_ddd: profile.telefone1_ddd,
            telefone1_numero: profile.telefone1_numero,
            endereco: profile.address,
            endereco_numero: profile.endereco_numero,
            complemento: profile.complemento,
            bairro: profile.neighborhood,
            estado: profile.state,
            cidade: profile.city,
            cep: profile.zip_code,
            contribuinte: profile.contribuinte,
            pessoa_fisica: profile.pessoa_fisica ? 'S' : 'N',
            exterior: profile.exterior ? 'S' : 'N',
            optante_simples_nacional: profile.optante_simples_nacional ? 'S' : 'N',
            inativo: profile.inativo ? 'S' : 'N',
            bloqueado: profile.bloqueado ? 'S' : 'N',
            tipo_atividade: profile.tipo_atividade,
          }]
        };

        // Send request to Omie API
        const response = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        });

        const result = await response.json();
        console.log(`Resposta do Omie para ${profile.full_name}:`, result);

        if (result.codigo_cliente_omie) {
          // Update profile with Omie code and sync status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              omie_code: result.codigo_cliente_omie.toString(),
              omie_sync: true
            })
            .eq('id', profile.id);

          if (updateError) throw updateError;
          console.log(`Cliente ${profile.full_name} sincronizado com sucesso. Código Omie: ${result.codigo_cliente_omie}`);
        }
      } catch (error) {
        console.error(`Erro ao sincronizar cliente ${profile.full_name}:`, error);
      }
    }

    return new Response(JSON.stringify({
      message: `${profiles.length} profiles synchronized with Omie`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

