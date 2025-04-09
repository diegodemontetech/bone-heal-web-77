
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // This is a preflight request. Reply successfully:
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get Mercado Pago credentials from system_settings or environment variables
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
      .in('key', ['MP_ACCESS_TOKEN', 'MP_PUBLIC_KEY']);
    
    if (settingsError) {
      console.error("Error fetching MP settings:", settingsError);
    }
    
    // Get access token from settings or environment
    let accessToken = "";
    let publicKey = "";
    
    if (settingsData && settingsData.length > 0) {
      settingsData.forEach(setting => {
        if (setting.key === 'MP_ACCESS_TOKEN' && setting.value) {
          accessToken = setting.value.toString();
        }
        if (setting.key === 'MP_PUBLIC_KEY' && setting.value) {
          publicKey = setting.value.toString();
        }
      });
    }
    
    // Fall back to environment variables if settings not found
    if (!accessToken) {
      accessToken = Deno.env.get("MP_ACCESS_TOKEN") || "APP_USR-609050106721186-021911-eae43656d661dca581ec088d09694fd5-2268930884";
    }
    
    if (!publicKey) {
      publicKey = Deno.env.get("MP_PUBLIC_KEY") || "APP_USR-711c6c25-bab3-4517-8ecf-c258c5ee4691";
    }
    
    // Test Mercado Pago connection
    const response = await fetch("https://api.mercadopago.com/v1/payment_methods", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mercado Pago API error: ${response.status} - ${errorText}`);
    }
    
    const paymentMethods = await response.json();
    
    // Add a log in the system_logs table
    await supabase.from('system_logs').insert({
      type: 'mercadopago_test',
      source: 'edge_function',
      status: 'success',
      details: 'MP connection test successful'
    });
    
    // Return the payment methods
    return new Response(
      JSON.stringify({
        success: true,
        message: "Mercado Pago connection successful",
        data: {
          payment_methods_count: paymentMethods.length,
          public_key_prefix: publicKey.substring(0, 10) + "...",
          access_token_prefix: accessToken.substring(0, 10) + "..."
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error in test-mercadopago:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
