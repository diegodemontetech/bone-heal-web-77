
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Webhook WhatsApp recebido:", JSON.stringify(payload));

    // Log do webhook recebido
    await supabase
      .from("whatsapp_logs")
      .insert([
        {
          payload: payload,
          type: "webhook",
        },
      ]);

    // Extrair informações importantes do webhook
    if (payload.event === "messages.upsert") {
      // Processar apenas mensagens novas do tipo texto
      const message = payload.data?.messages?.[0];
      
      if (message && message.type === "text" && message.fromMe === false) {
        const phoneNumber = message.key.remoteJid.replace(/[@].*$/, "");
        const messageContent = message.message.conversation || message.message.extendedTextMessage?.text || "";
        
        // Verificar se é um número de telefone que já está no sistema
        const { data: existingUser, error: userError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("phone", phoneNumber)
          .maybeSingle();

        // Dados para o log de mensagem
        const messageData = {
          from: phoneNumber,
          message: messageContent,
          is_from_customer: true,
          user_id: existingUser?.id || null,
          name: existingUser?.full_name || "Visitante",
        };

        // Salvar a mensagem no banco
        await supabase.from("whatsapp_messages").insert([messageData]);

        // Se não for um usuário existente, criar um lead
        if (!existingUser) {
          // Verificar se já existe um lead com este número
          const { data: existingLead } = await supabase
            .from("contact_leads")
            .select("id")
            .eq("phone", phoneNumber)
            .maybeSingle();

          if (!existingLead) {
            // Criar novo lead
            await supabase.from("contact_leads").insert([
              {
                name: "Cliente WhatsApp",
                phone: phoneNumber,
                source: "whatsapp",
                status: "new",
                reason: "Contato inicial via WhatsApp"
              }
            ]);
          }
        }

        // Enviar notificação para atendente humano se precisar
        await supabase.from("notifications").insert([
          {
            type: "whatsapp_human_needed",
            status: "pending",
            data: {
              phoneNumber,
              message: messageContent,
              userId: existingUser?.id || null
            }
          }
        ]);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro no webhook WhatsApp:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
