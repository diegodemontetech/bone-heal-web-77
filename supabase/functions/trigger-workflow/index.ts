
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratamento para preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { workflow, data } = await req.json();
    console.log(`Disparando workflow: ${workflow} com dados:`, data);

    // Configurar o webhook do n8n (precisaria do URL real do n8n)
    const n8nWebhookBase = Deno.env.get('N8N_WEBHOOK_BASE_URL');
    
    if (!n8nWebhookBase) {
      throw new Error("URL de webhook do n8n não configurado");
    }

    const n8nWebhookUrl = `${n8nWebhookBase}/${workflow}`;
    console.log(`Enviando dados para webhook: ${n8nWebhookUrl}`);

    // Enviar os dados para o webhook do n8n
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro no webhook: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Resposta do webhook:", responseData);

    return new Response(
      JSON.stringify({ success: true, message: "Workflow disparado com sucesso" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Erro ao disparar workflow:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erro desconhecido" 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
