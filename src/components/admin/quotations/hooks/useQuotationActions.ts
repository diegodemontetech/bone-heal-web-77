
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export const useQuotationActions = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Função para gerar e baixar o PDF do orçamento
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

      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Deixamos de usar a imagem externa devido ao erro CORS
      // Adicionar título
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text("BONE HEAL - ORÇAMENTO", 105, 20, { align: "center" });
      
      // Número do orçamento
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Nº: ${quotationId.substring(0, 8)}`, 105, 27, { align: "center" });
      
      // Data atual e validade
      const currentDate = new Date();
      const validityDate = new Date();
      validityDate.setDate(validityDate.getDate() + 5);
      
      doc.setFontSize(10);
      doc.text(`Data de emissão: ${currentDate.toLocaleDateString('pt-BR')}`, 105, 33, { align: "center" });
      doc.text(`Válido até: ${validityDate.toLocaleDateString('pt-BR')}`, 105, 39, { align: "center" });
      
      // Informações do cliente
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("DADOS DO CLIENTE", 15, 55);
      
      if (quotation.customer_info) {
        const customer = quotation.customer_info;
        doc.setFontSize(10);
        doc.text(`Nome: ${customer.name || 'N/A'}`, 15, 62);
        doc.text(`Documento: ${customer.document || 'N/A'}`, 15, 68);
        doc.text(`Email: ${customer.email || 'N/A'}`, 15, 74);
        doc.text(`Telefone: ${customer.phone || 'N/A'}`, 15, 80);
        doc.text(`Endereço: ${customer.address || 'N/A'}, ${customer.city || 'N/A'} - ${customer.state || 'N/A'}`, 15, 86);
      }
      
      // Tabela de produtos
      doc.setFontSize(12);
      doc.text("PRODUTOS", 15, 100);
      
      if (quotation.items && quotation.items.length > 0) {
        // Implementamos manualmente a tabela, já que houve problemas com o autoTable
        const cols = ["Item", "Quantidade", "Valor Unit.", "Subtotal"];
        const colWidths = [90, 30, 30, 30];
        const startX = 15;
        let startY = 105;
        
        // Cabeçalho da tabela
        doc.setFillColor(0, 102, 204);
        doc.setTextColor(255, 255, 255);
        doc.rect(startX, startY, 180, 10, 'F');
        
        // Escrever os cabeçalhos
        let currentX = startX + 5;
        for (let i = 0; i < cols.length; i++) {
          doc.text(cols[i], currentX, startY + 6);
          currentX += colWidths[i];
        }
        
        // Conteúdo da tabela
        startY += 10;
        doc.setTextColor(0, 0, 0);
        
        // Alternar cores das linhas
        let isEven = false;
        for (const item of quotation.items) {
          if (isEven) {
            doc.setFillColor(240, 240, 240);
            doc.rect(startX, startY, 180, 10, 'F');
          }
          
          let rowX = startX + 5;
          doc.text(item.name.substring(0, 40), rowX, startY + 6);
          rowX += colWidths[0];
          
          doc.text(String(item.quantity), rowX, startY + 6);
          rowX += colWidths[1];
          
          doc.text(formatCurrency(item.price), rowX, startY + 6);
          rowX += colWidths[2];
          
          doc.text(formatCurrency(item.price * item.quantity), rowX, startY + 6);
          
          startY += 10;
          isEven = !isEven;
        }
        
        // Footer da tabela com os totais
        startY += 5;
        doc.setFillColor(240, 240, 240);
        doc.rect(startX, startY, 180, 10, 'F');
        doc.text("Subtotal:", startX + 125, startY + 6);
        doc.text(formatCurrency(quotation.subtotal_amount), startX + 155, startY + 6);
        
        startY += 10;
        doc.rect(startX, startY, 180, 10, 'F');
        doc.text("Desconto:", startX + 125, startY + 6);
        doc.text(formatCurrency(quotation.discount_amount), startX + 155, startY + 6);
        
        startY += 10;
        doc.setFillColor(230, 230, 230);
        doc.rect(startX, startY, 180, 10, 'F');
        doc.setFontSize(12);
        doc.text("Total:", startX + 125, startY + 6);
        doc.text(formatCurrency(quotation.total_amount), startX + 155, startY + 6);
      }
      
      // Forma de pagamento
      let finalY = startY + 20;
      doc.setFontSize(10);
      doc.text(`Forma de pagamento: ${quotation.payment_method === 'credit_card' ? 'Cartão de Crédito' : 
                                       quotation.payment_method === 'pix' ? 'PIX' : 
                                       quotation.payment_method === 'boleto' ? 'Boleto Bancário' : 
                                       'A combinar'}`, 15, finalY);
      
      // Observações e termos
      doc.text("Observações:", 15, finalY + 10);
      doc.text("- Orçamento válido por 5 dias a partir da data de emissão.", 15, finalY + 16);
      doc.text("- Pagamento conforme condições acordadas.", 15, finalY + 22);
      doc.text("- Prazo de entrega a combinar após confirmação de pedido.", 15, finalY + 28);
      
      // Rodapé
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("BoneHeal Ltda. - CNPJ: 00.000.000/0001-00", 105, pageHeight - 10, { align: "center" });
      doc.text("Av. Exemplo, 1000 - São Paulo/SP - CEP 00000-000 - Tel: (11) 0000-0000", 105, pageHeight - 6, { align: "center" });
      
      // Baixar o PDF
      doc.save(`orcamento-${quotationId.substring(0, 8)}.pdf`);
      
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

      // Criar o pedido baseado no orçamento - corrigindo para o esquema correto
      const orderData = {
        user_id: quotation.user_id,
        items: quotation.items,
        subtotal: quotation.subtotal_amount,
        total_amount: quotation.total_amount,
        discount: quotation.discount_amount,
        payment_method: quotation.payment_method,
        status: "pending",
        shipping_address: quotation.customer_info ? {
          name: quotation.customer_info.name,
          address: quotation.customer_info.address,
          city: quotation.customer_info.city,
          state: quotation.customer_info.state
        } : null
      };

      // Inserir o novo pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error("Erro detalhado ao converter:", orderError);
        throw new Error(`Erro ao inserir pedido: ${orderError.message}`);
      }

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
      const customerName = quotation.customer_info?.name || "Cliente";
      const message = `Olá ${customerName}, segue o orçamento solicitado no valor de ${formatCurrency(quotation.total_amount)}. Você pode visualizá-lo pelo link: ${quotationViewUrl}`;
      
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
    handleDownloadPdf,
    handleConvertToOrder,
    handleShareWhatsApp
  };
};
