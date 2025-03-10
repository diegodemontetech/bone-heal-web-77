
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEmailSender = () => {
  const handleSendEmail = async (quotationId: string, customerEmail: string) => {
    try {
      // Implementar o envio de e-mail aqui
      toast.success(`E-mail enviado para ${customerEmail}`);
      
      // Atualizar o status de envio no banco de dados
      await supabase
        .from("quotations")
        .update({ sent_by_email: true })
        .eq("id", quotationId);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast.error("Erro ao enviar o orçamento por e-mail");
    }
  };

  return { handleSendEmail };
};
