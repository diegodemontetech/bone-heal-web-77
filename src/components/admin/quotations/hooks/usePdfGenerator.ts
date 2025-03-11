
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";
import { Quotation, QuotationItem } from "./useQuotationsQuery";

export const usePdfGenerator = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePdf = async (quotationId: string) => {
    setIsGeneratingPdf(true);
    try {
      // Buscar dados do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*, customer:profiles(full_name, email, phone, address, city, state)")
        .eq("id", quotationId)
        .single();

      if (error) throw error;
      if (!quotation) throw new Error("Orçamento não encontrado");

      // Criar PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Configurações do documento
      const margin = 20;
      let yPos = 20;
      
      // Estilo do texto
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // Cabeçalho
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("BONE HEAL", pageWidth / 2, yPos, { align: "center" });
      yPos += 10;
      
      doc.setFontSize(14);
      doc.text("ORÇAMENTO", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      // Informações do orçamento
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Nº do Orçamento: ${quotation.id.substring(0, 8)}`, margin, yPos);
      yPos += 5;
      
      doc.text(`Data: ${new Date(quotation.created_at).toLocaleDateString('pt-BR')}`, margin, yPos);
      yPos += 5;
      
      doc.text(`Validade: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`, margin, yPos);
      yPos += 10;

      // Dados do cliente
      const customer = Array.isArray(quotation.customer) 
        ? (quotation.customer.length > 0 ? quotation.customer[0] : null) 
        : quotation.customer;
      
      if (customer) {
        doc.setFont("helvetica", "bold");
        doc.text("DADOS DO CLIENTE", margin, yPos);
        yPos += 5;
        
        doc.setFont("helvetica", "normal");
        doc.text(`Nome: ${customer.full_name || 'Não informado'}`, margin, yPos);
        yPos += 5;
        
        doc.text(`Email: ${customer.email || 'Não informado'}`, margin, yPos);
        yPos += 5;
        
        doc.text(`Telefone: ${customer.phone || 'Não informado'}`, margin, yPos);
        yPos += 5;
        
        const address = customer.address ? 
          `${customer.address}, ${customer.city || ''} - ${customer.state || ''}` : 
          'Não informado';
        doc.text(`Endereço: ${address}`, margin, yPos);
        yPos += 10;
      }

      // Lista de produtos
      doc.setFont("helvetica", "bold");
      doc.text("PRODUTOS", margin, yPos);
      yPos += 7;

      // Cabeçalho da tabela
      const tableHeaders = ["Produto", "Qtd", "Preço Unit.", "Total"];
      const columnWidths = [pageWidth - 140, 20, 40, 40];
      let xPos = margin;
      
      tableHeaders.forEach((header, i) => {
        doc.text(header, xPos, yPos);
        xPos += columnWidths[i];
      });
      
      yPos += 5;
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;

      // Dados da tabela
      const items = quotation.items || [];
      if (items.length > 0) {
        items.forEach((item: QuotationItem) => {
          xPos = margin;
          
          // Produto (com quebra de linha se necessário)
          const productName = item.product_name || "Produto sem nome";
          const lines = doc.splitTextToSize(productName, columnWidths[0] - 5);
          doc.setFont("helvetica", "normal");
          doc.text(lines, xPos, yPos);
          
          // Determinar a altura máxima dessa linha
          const lineHeight = lines.length * 5;
          
          // Quantidade
          xPos += columnWidths[0];
          doc.text(item.quantity.toString(), xPos, yPos);
          
          // Preço unitário
          xPos += columnWidths[1];
          doc.text(formatCurrency(item.unit_price), xPos, yPos);
          
          // Total
          xPos += columnWidths[2];
          doc.text(formatCurrency(item.total_price), xPos, yPos);
          
          yPos += Math.max(lineHeight, 7); // Garantir espaço mínimo entre linhas
          
          // Verificar se precisamos de uma nova página
          if (yPos > doc.internal.pageSize.getHeight() - 50) {
            doc.addPage();
            yPos = 20; // Reset para o topo da nova página
          }
        });
      } else {
        doc.setFont("helvetica", "italic");
        doc.text("Nenhum produto no orçamento", margin, yPos);
        yPos += 7;
      }

      // Linha divisória
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Resumo de valores
      const rightAlign = pageWidth - margin;
      
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", rightAlign - 70, yPos);
      doc.text(formatCurrency(quotation.subtotal_amount || 0), rightAlign, yPos, { align: "right" });
      yPos += 7;
      
      doc.text("Desconto:", rightAlign - 70, yPos);
      doc.text(formatCurrency(quotation.discount_amount || 0), rightAlign, yPos, { align: "right" });
      yPos += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL:", rightAlign - 70, yPos);
      doc.text(formatCurrency(quotation.total_amount || 0), rightAlign, yPos, { align: "right" });
      yPos += 15;

      // Forma de pagamento
      doc.setFont("helvetica", "normal");
      doc.text(`Forma de pagamento: ${quotation.payment_method || 'Não especificada'}`, margin, yPos);
      yPos += 15;

      // Rodapé
      const currentDate = new Date().toLocaleDateString('pt-BR');
      doc.setFontSize(8);
      doc.text(`Documento gerado em ${currentDate}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

      // Salvar o PDF
      doc.save(`orcamento-${quotation.id.substring(0, 8)}.pdf`);
      
      toast.success("PDF gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Não foi possível gerar o PDF do orçamento");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    isGeneratingPdf,
    generatePdf
  };
};
