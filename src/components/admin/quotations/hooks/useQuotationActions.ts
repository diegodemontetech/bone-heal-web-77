
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useQuotationActions = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Função para gerar o PDF do orçamento
  const handleGeneratePdf = async (quotationId: string) => {
    setIsGeneratingPdf(true);
    try {
      // Buscar os dados completos do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*")
        .eq("id", quotationId)
        .single();

      if (error) throw error;

      // Aqui implementaríamos a lógica para gerar o PDF com os dados do orçamento
      // Por enquanto, vamos apenas simular isso
      
      toast.success("PDF gerado com sucesso");
      
      // Retornar os dados do orçamento para uso posterior
      return quotation;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF do orçamento");
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

      // Criar o pedido baseado no orçamento
      const orderData = {
        user_id: quotation.user_id,
        customer_info: quotation.customer_info,
        items: quotation.items,
        subtotal: quotation.subtotal_amount,
        total_amount: quotation.total_amount,
        discount: quotation.discount_amount,
        payment_method: quotation.payment_method,
        status: "pending",
        voucher_id: quotation.voucher_id,
      };

      // Inserir o novo pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Atualizar o status do orçamento para "converted"
      await supabase
        .from("quotations")
        .update({ status: "converted" })
        .eq("id", quotationId);

      toast.success("Orçamento convertido em pedido com sucesso");
      return order;
    } catch (error) {
      console.error("Erro ao converter orçamento em pedido:", error);
      toast.error("Erro ao converter orçamento em pedido");
    } finally {
      setIsConvertingToOrder(false);
    }
  };

  // Função para compartilhar via WhatsApp
  const handleShareWhatsApp = async (quotationId: string) => {
    setIsSharing(true);
    try {
      // Primeiro geramos o PDF
      const quotation = await handleGeneratePdf(quotationId);
      
      if (!quotation) throw new Error("Falha ao obter dados do orçamento");
      
      // Criar uma mensagem para o WhatsApp
      const customerName = quotation.customer_info?.name || "Cliente";
      const message = `Olá ${customerName}, segue o orçamento solicitado no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotation.total_amount)}. Aguardamos seu retorno!`;
      
      // Codificar a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      
      // Buscar número de telefone do cliente ou usar um padrão
      const phone = quotation.customer_info?.phone?.replace(/\D/g, '') || "";
      
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
    handleGeneratePdf,
    handleConvertToOrder,
    handleShareWhatsApp
  };
};
