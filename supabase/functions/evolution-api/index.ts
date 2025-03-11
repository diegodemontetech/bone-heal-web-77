
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const EVOLUTION_API_URL = Deno.env.get("EVOLUTION_API_URL");
    const EVOLUTION_API_KEY = Deno.env.get("EVOLUTION_API_KEY");

    // Verificar se as configurações estão definidas
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "API Evolution não configurada. Configure a URL e a chave da API.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { action, instanceName = "default" } = await req.json();

    // Verificar ação solicitada
    if (!action) {
      return new Response(
        JSON.stringify({ success: false, message: "Ação não especificada" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Tratar diferentes ações
    switch (action) {
      case "getInstance":
        return await createInstance(EVOLUTION_API_URL, EVOLUTION_API_KEY, instanceName);
      
      case "getQRCode":
        return await getQRCode(EVOLUTION_API_URL, EVOLUTION_API_KEY, instanceName);
      
      case "getConnectionStatus":
        return await getConnectionStatus(EVOLUTION_API_URL, EVOLUTION_API_KEY, instanceName);
      
      default:
        return new Response(
          JSON.stringify({ success: false, message: "Ação desconhecida" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
    }
  } catch (error) {
    console.error("Erro na função Evolution API:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Função para criar uma nova instância
async function createInstance(apiUrl: string, apiKey: string, instanceName: string) {
  try {
    const url = `${apiUrl}/instance/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      },
      body: JSON.stringify({
        instanceName,
        webhook: {
          url: Deno.env.get("SUPABASE_URL") + "/functions/v1/webhook-whatsapp",
          enabled: true
        }
      })
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        success: response.ok,
        message: response.ok ? "Instância criada com sucesso" : data.message || "Erro ao criar instância",
        data
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.ok ? 200 : 500,
      }
    );
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

// Função para gerar QR Code
async function getQRCode(apiUrl: string, apiKey: string, instanceName: string) {
  try {
    // Primeiro, iniciar a conexão
    const connectionUrl = `${apiUrl}/instance/connect/${instanceName}`;
    await fetch(connectionUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      }
    });

    // Aguardar um momento para que a conexão seja iniciada
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Obter o QR Code
    const qrUrl = `${apiUrl}/instance/qrcode/${instanceName}?image=true`;
    const response = await fetch(qrUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: error.message || "Erro ao gerar QR Code" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status,
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        qrcode: data.qrcode,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

// Função para verificar o status da conexão
async function getConnectionStatus(apiUrl: string, apiKey: string, instanceName: string) {
  try {
    const url = `${apiUrl}/instance/connectionState/${instanceName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      }
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        success: response.ok,
        status: data.state || "unknown",
        data
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.ok ? 200 : 500,
      }
    );
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
