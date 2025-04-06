
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
      .select('key, value')
      .in('key', ['MP_ACCESS_TOKEN', 'MP_PUBLIC_KEY']);
    
    // Extrair token do banco de dados ou usar o do ambiente
    let access_token = Deno.env.get('MP_ACCESS_TOKEN');
    
    if (settingsData && settingsData.length > 0) {
      const tokenSetting = settingsData.find(s => s.key === 'MP_ACCESS_TOKEN');
      if (tokenSetting && tokenSetting.value) {
        access_token = tokenSetting.value;
        console.log("Usando token do banco de dados");
      }
    }

    if (!access_token) {
      throw new Error("Token do Mercado Pago não configurado");
    }

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
      payment_methods: {
        excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }], // Permite apenas PIX
        installments: 1,
      },
      payer: {
        email: payer.email,
      },
      statement_descriptor: "BoneHeal",
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      notification_url: `${Deno.env.get("APP_URL") || "https://boneheal.com.br"}/api/webhook/mercadopago`,
      back_urls: {
        success: `${Deno.env.get("APP_URL") || "https://boneheal.com.br"}/orders/confirmation/${orderId}`,
        failure: `${Deno.env.get("APP_URL") || "https://boneheal.com.br"}/checkout/payment`,
        pending: `${Deno.env.get("APP_URL") || "https://boneheal.com.br"}/orders/pending/${orderId}`,
      },
    };

    console.log("Dados da preferência:", JSON.stringify(preferenceData, null, 2));

    // Criar preferência no Mercado Pago
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API do Mercado Pago: ${response.status} - ${errorText}`);
      throw new Error(`Erro na API do Mercado Pago: ${errorText}`);
    }

    const data = await response.json();
    console.log("Resposta do Mercado Pago:", JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
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
