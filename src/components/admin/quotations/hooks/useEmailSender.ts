
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const useEmailSender = () => {
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (quotationId: string, customerEmail: string) => {
    if (!customerEmail) {
      toast.error("Email do cliente não disponível");
      return;
    }

    setIsSending(true);
    try {
      // Simulação de envio de e-mail para o cliente
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Atualizar o status de envio no banco de dados
      const { error } = await supabase
        .from("quotations")
        .update({ sent_by_email: true })
        .eq("id", quotationId);
      
      if (error) throw error;

      toast.success(`E-mail enviado com sucesso para ${customerEmail}`, {
        description: "O orçamento foi enviado para o cliente"
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast.error("Não foi possível enviar o orçamento por e-mail", {
        description: "Tente novamente mais tarde"
      });
    } finally {
      setIsSending(false);
    }
  };

  return { handleSendEmail, isSending };
};
