
import { useState } from "react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const usePdfGenerator = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePdf = async (quotationId: string) => {
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
        // Implementamos manualmente a tabela
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
      const finalY = startY + 20;
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

  return {
    isGeneratingPdf,
    generatePdf
  };
};
