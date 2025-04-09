
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface CheckoutRequest {
  orderId: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  shipping_cost?: number;
  payer: {
    email: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: CheckoutRequest = await req.json();
    const { orderId, items, shipping_cost = 0, payer } = body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Parâmetros inválidos");
    }

    console.log("Criando checkout para pedido:", orderId);

    // Buscar credenciais do Mercado Pago do banco de dados
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
      .in('key', ['MP_ACCESS_TOKEN', 'MP_PUBLIC_KEY']);
    
    // Extrair token do banco de dados ou usar o do ambiente
    let access_token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    
    if (settingsData && settingsData.length > 0) {
      for (const setting of settingsData) {
        if (setting.key === 'MP_ACCESS_TOKEN' && setting.value) {
          access_token = setting.value.toString();
          console.log("Usando token do banco de dados");
          break;
        }
      }
    }

    if (!access_token) {
      console.error("Token do Mercado Pago não encontrado!");
      
      // Use a fallback from config.toml
      access_token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || '';
      
      if (!access_token) {
        throw new Error("Token do Mercado Pago não configurado");
      }
      
      console.log("Usando token de fallback do arquivo de configuração");
    }

    console.log("Token utilizado (primeiros caracteres):", access_token.substring(0, 10) + "...");

    // Obter URL do frontend para redirecionamento
    const appUrl = Deno.env.get("APP_URL") || "https://workshop.lovable.dev";

    console.log("URL da aplicação para redirecionamento:", appUrl);

    // Preparar dados para a API do Mercado Pago
    const preferenceData = {
      external_reference: orderId,
      items: items.map((item) => ({
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      shipments: {
        cost: shipping_cost,
        mode: "not_specified",
      },
      back_urls: {
        success: `${appUrl}/orders/confirmation/${orderId}`,
        failure: `${appUrl}/checkout/error`,
        pending: `${appUrl}/orders/pending/${orderId}`,
      },
      auto_return: "approved",
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
      statement_descriptor: "BoneHeal",
    };

    console.log("Dados da preferência:", JSON.stringify(preferenceData, null, 2));

    // Criar preferência no Mercado Pago
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "X-Idempotency-Key": `checkout-${orderId}-${Date.now()}`
      },
      body: JSON.stringify(preferenceData),
    });

    const responseStatus = response.status;
    console.log("Status da resposta MP:", responseStatus);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API do Mercado Pago: ${response.status} - ${errorText}`);
      
      // Log the error in the database
      await supabase
        .from('system_logs')
        .insert({
          type: 'mercadopago_error',
          source: 'edge_function',
          status: 'error',
          details: `API Error: ${errorText}`
        });
        
      throw new Error(`Erro na API do Mercado Pago: ${errorText}`);
    }

    const data = await response.json();
    console.log("Resposta do Mercado Pago:", JSON.stringify(data, null, 2));

    // Registrar o sucesso no log do sistema
    await supabase
      .from('system_logs')
      .insert({
        type: 'mercadopago_checkout',
        source: 'edge_function',
        status: 'success',
        details: `Preferência criada para pedido ${orderId}`
      });

    // Atualizar o pedido com o ID da preferência do Mercado Pago e as URLs
    await supabase
      .from('orders')
      .update({ 
        mp_preference_id: data.id,
        payment_details: {
          preference_id: data.id,
          init_point: data.init_point,
          sandbox_init_point: data.sandbox_init_point
        }
      })
      .eq('id', orderId);

    // Retornar os dados da preferência
    return new Response(JSON.stringify({
      success: true,
      preferenceId: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro no checkout do Mercado Pago:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Erro ao processar pagamento via Mercado Pago",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
