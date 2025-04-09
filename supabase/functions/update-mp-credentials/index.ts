
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface UpdateCredentialsRequest {
  accessToken: string;
  publicKey: string;
  clientId?: string;
  clientSecret?: string;
}

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { accessToken, publicKey, clientId, clientSecret }: UpdateCredentialsRequest = await req.json();

    if (!accessToken || !publicKey) {
      throw new Error("Credenciais incompletas. Forneça pelo menos accessToken e publicKey.");
    }

    console.log("Atualizando credenciais do Mercado Pago");
    
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Atualizar ou inserir configuração na tabela 'system_settings'
    console.log("Salvando Access Token");
    const { error: accessTokenError } = await supabase
      .from('system_settings')
      .upsert({
        key: 'MP_ACCESS_TOKEN',
        value: accessToken,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (accessTokenError) {
      throw new Error(`Erro ao salvar Access Token: ${accessTokenError.message}`);
    }

    console.log("Salvando Public Key");
    const { error: publicKeyError } = await supabase
      .from('system_settings')
      .upsert({
        key: 'MP_PUBLIC_KEY',
        value: publicKey,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (publicKeyError) {
      throw new Error(`Erro ao salvar Public Key: ${publicKeyError.message}`);
    }

    // Opcionais: Client ID e Client Secret
    if (clientId) {
      console.log("Salvando Client ID");
      await supabase
        .from('system_settings')
        .upsert({
          key: 'MP_CLIENT_ID',
          value: clientId,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });
    }

    if (clientSecret) {
      console.log("Salvando Client Secret");
      await supabase
        .from('system_settings')
        .upsert({
          key: 'MP_CLIENT_SECRET',
          value: clientSecret,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });
    }

    // Registrar no log do sistema
    await supabase
      .from('system_logs')
      .insert({
        type: 'mercadopago_credentials',
        source: 'edge_function',
        status: 'success',
        details: 'Credenciais do Mercado Pago atualizadas'
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Credenciais do Mercado Pago atualizadas com sucesso"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Erro ao atualizar credenciais do Mercado Pago:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Erro ao atualizar credenciais: ${error instanceof Error ? error.message : String(error)}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
