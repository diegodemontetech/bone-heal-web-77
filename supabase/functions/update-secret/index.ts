
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar autenticação - apenas administradores podem atualizar segredos
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") || "" },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Verificar se o usuário é administrador
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return new Response(
        JSON.stringify({ error: "Você não tem permissão para atualizar segredos" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    // Obter os segredos a serem atualizados
    const { secrets } = await req.json();

    if (!secrets || typeof secrets !== "object") {
      return new Response(
        JSON.stringify({ error: "Formato de segredos inválido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Usamos o cliente administrativo para modificar segredos
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Na produção real, seria necessário usar a API do Supabase para atualizar segredos
    // Esta é uma simulação onde "salvamos" os valores dos segredos em uma tabela
    for (const [key, value] of Object.entries(secrets)) {
      if (typeof value === "string") {
        // Simulação: atualizar a tabela de configurações com os segredos
        await supabaseAdmin
          .from("app_secrets")
          .upsert(
            {
              key,
              value,
              updated_by: user.id,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" }
          );

        console.log(`Segredo atualizado: ${key}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Segredos atualizados com sucesso" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao atualizar segredos:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
