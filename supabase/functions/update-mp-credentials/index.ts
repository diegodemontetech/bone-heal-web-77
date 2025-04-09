
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface Credentials {
  accessToken?: string;
  publicKey?: string;
  clientId?: string;
  clientSecret?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! }
        }
      }
    );

    // Get user info
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({
        success: false,
        message: "Unauthorized",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return new Response(JSON.stringify({
        success: false,
        message: "Acesso permitido apenas para administradores",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Get credentials from request body
    const credentials: Credentials = await req.json();

    // Validate credentials
    if (!credentials.accessToken || !credentials.publicKey) {
      return new Response(JSON.stringify({
        success: false,
        message: "Access Token e Public Key são obrigatórios",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Update credentials in database
    const updates = [
      { key: "MP_ACCESS_TOKEN", value: credentials.accessToken },
      { key: "MP_PUBLIC_KEY", value: credentials.publicKey }
    ];

    if (credentials.clientId) {
      updates.push({ key: "MP_CLIENT_ID", value: credentials.clientId });
    }

    if (credentials.clientSecret) {
      updates.push({ key: "MP_CLIENT_SECRET", value: credentials.clientSecret });
    }

    for (const update of updates) {
      const { error } = await supabaseClient
        .from("system_settings")
        .upsert({ key: update.key, value: update.value })
        .select();

      if (error) {
        console.error(`Error updating ${update.key}:`, error);
        return new Response(JSON.stringify({
          success: false,
          message: `Erro ao atualizar ${update.key}: ${error.message}`,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Credenciais atualizadas com sucesso",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
