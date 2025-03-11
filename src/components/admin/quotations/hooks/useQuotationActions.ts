
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useQuotationActions = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Função para baixar o PDF do orçamento
  const handleDownloadPdf = async (quotationId: string) => {
    setIsGeneratingPdf(true);
    try {
      // Buscar os dados completos do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*")
        .eq("id", quotationId)
        .single();

      if (error) throw error;

      // Simulação de geração de PDF (no mundo real, seria uma API de geração de PDF)
      // Aqui vamos apenas simular o download com um delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Criando um objeto Blob para download (simulação)
      const blob = new Blob([JSON.stringify(quotation, null, 2)], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento-${quotationId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF baixado com sucesso");
      
      // Retornar os dados do orçamento para uso posterior
      return quotation;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao baixar o PDF do orçamento");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Função para converter orçamento em pedido de venda
  const handleConvertToOrder = async (quotationId: string) => {
    setIsConvertingToOrder(true);
    try {
      // Buscar os dados do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*")
        .eq("id", quotationId)
        .single();

      if (error) throw error;

      // Verificar se já foi convertido
      if (quotation.status === "converted") {
        toast.error("Este orçamento já foi convertido em pedido");
        return null;
      }

      // Criar o pedido baseado no orçamento
      const orderData = {
        user_id: quotation.user_id,
        customer_id: quotation.customer_id,
        items: quotation.items,
        subtotal: quotation.subtotal_amount,
        total_amount: quotation.total_amount,
        discount_amount: quotation.discount_amount,
        payment_method: quotation.payment_method,
        status: "pending",
        voucher_id: quotation.voucher_id,
        quotation_id: quotationId
      };

      // Inserir o novo pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Atualizar o status do orçamento para "converted"
      const { error: updateError } = await supabase
        .from("quotations")
        .update({ status: "converted" })
        .eq("id", quotationId);

      if (updateError) throw updateError;

      toast.success("Orçamento convertido em pedido com sucesso");
      return order;
    } catch (error: any) {
      console.error("Erro ao converter orçamento em pedido:", error);
      toast.error(`Erro ao converter orçamento: ${error.message || "Erro desconhecido"}`);
      return null;
    } finally {
      setIsConvertingToOrder(false);
    }
  };

  // Função para compartilhar via WhatsApp
  const handleShareWhatsApp = async (quotationId: string) => {
    setIsSharing(true);
    try {
      // Primeiro geramos o PDF
      const quotation = await handleDownloadPdf(quotationId);
      
      if (!quotation) throw new Error("Falha ao obter dados do orçamento");
      
      // Criar o link para visualização do orçamento (no frontend)
      const quotationViewUrl = `${window.location.origin}/admin/quotations/view/${quotationId}`;
      
      // Criar uma mensagem para o WhatsApp
      const customerName = quotation.customer?.full_name || "Cliente";
      const message = `Olá ${customerName}, segue o orçamento solicitado no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotation.total_amount)}. Você pode visualizá-lo pelo link: ${quotationViewUrl}`;
      
      // Codificar a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      
      // Buscar número de telefone do cliente ou usar um padrão
      const phone = quotation.customer?.phone?.replace(/\D/g, '') || "";
      
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
  
  // Retornar todas as funções e estados
  return {
    isGeneratingPdf,
    isConvertingToOrder,
    isSharing,
    handleDownloadPdf,
    handleConvertToOrder,
    handleShareWhatsApp
  };
};
