
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { parseJsonObject } from "@/utils/supabaseJsonUtils";

export const useShareWhatsApp = () => {
  const [isSharing, setIsSharing] = useState(false);

  const shareViaWhatsApp = async (quotationId: string) => {
    setIsSharing(true);
    try {
      // Primeiro buscamos o orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*")
        .eq("id", quotationId)
        .single();
        
      if (error) throw error;
      
      if (!quotation) throw new Error("Falha ao obter dados do orçamento");
      
      // Criar o link para visualização do orçamento no próprio site
      const quotationViewUrl = `${window.location.origin}/quotations/view/${quotationId}`;
      
      // Criar uma mensagem para o WhatsApp
      const customerInfo = parseJsonObject(quotation.customer_info, {});
      
      const customerName = customerInfo.name || "Cliente";
      const message = `Olá ${customerName}, segue o orçamento solicitado no valor de ${formatCurrency(quotation.total_amount)}. Você pode visualizá-lo pelo link: ${quotationViewUrl}`;
      
      // Codificar a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      
      // Buscar número de telefone do cliente ou usar um padrão
      const phone = customerInfo.phone ? customerInfo.phone.replace(/\D/g, '') : "";
      
      if (!phone) {
        toast.error("Não foi possível compartilhar: telefone do cliente não encontrado");
        return;
      }
      
      // Criar URL do WhatsApp
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      
      // Abrir em uma nova janela/aba
      window.open(whatsappUrl, '_blank');
      
      toast.success("Link do WhatsApp aberto para compartilhamento");
    } catch (error) {
      console.error("Erro ao compartilhar via WhatsApp:", error);
      toast.error("Erro ao compartilhar via WhatsApp");
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    shareViaWhatsApp
  };
};
