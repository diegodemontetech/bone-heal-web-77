
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TicketNotification {
  ticketNumber: number;
  subject: string;
  message: string;
  recipientEmail: string;
  recipientName: string;
  type: "new" | "update" | "resolved";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { ticketNumber, subject, message, recipientEmail, recipientName, type }: TicketNotification =
      await req.json();

    const emailTemplates = {
      new: {
        subject: `Novo Chamado #${ticketNumber} Criado - ${subject}`,
        html: `
          <h1>Olá ${recipientName},</h1>
          <p>Seu chamado foi criado com sucesso!</p>
          <p><strong>Número do Chamado:</strong> #${ticketNumber}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Mensagem:</strong> ${message}</p>
          <p>Acompanhe seu chamado através do nosso portal.</p>
        `,
      },
      update: {
        subject: `Atualização no Chamado #${ticketNumber} - ${subject}`,
        html: `
          <h1>Olá ${recipientName},</h1>
          <p>Seu chamado recebeu uma nova atualização!</p>
          <p><strong>Número do Chamado:</strong> #${ticketNumber}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Nova Mensagem:</strong> ${message}</p>
          <p>Acesse o portal para responder ou ver mais detalhes.</p>
        `,
      },
      resolved: {
        subject: `Chamado #${ticketNumber} Resolvido - ${subject}`,
        html: `
          <h1>Olá ${recipientName},</h1>
          <p>Seu chamado foi marcado como resolvido!</p>
          <p><strong>Número do Chamado:</strong> #${ticketNumber}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Resolução:</strong> ${message}</p>
          <p>Se precisar, você pode reabrir o chamado através do portal.</p>
        `,
      },
    };

    const template = emailTemplates[type];
    const emailResponse = await resend.emails.send({
      from: "Bone Heal <suporte@boneheal.com.br>",
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    });

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
