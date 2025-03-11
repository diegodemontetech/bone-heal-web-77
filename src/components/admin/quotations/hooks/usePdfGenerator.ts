import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";
import "jspdf-autotable";

export const usePdfGenerator = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePdf = async (quotationId: string) => {
    setIsGeneratingPdf(true);
    try {
      // Buscar dados do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*, customer:profiles(full_name, email, phone, address, city, state, zip_code, cnpj, cpf)")
        .eq("id", quotationId)
        .single();

      if (error) throw error;
      if (!quotation) throw new Error("Orçamento não encontrado");

      // Buscar informações adicionais dos produtos (imagens, etc.)
      const items = quotation.items || [];
      const enhancedItems = await Promise.all(items.map(async (item: any) => {
        if (item.product_id) {
          const { data: product } = await supabase
            .from("products")
            .select("main_image, default_image_url")
            .eq("id", item.product_id)
            .single();
          
          return {
            ...item,
            product_image: product?.main_image || product?.default_image_url
          };
        }
        return item;
      }));

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
      
      doc.text(`Validade: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`, margin, yPos);
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

        if (customer.cnpj) {
          doc.text(`CNPJ: ${customer.cnpj}`, margin, yPos);
          yPos += 5;
        } else if (customer.cpf) {
          doc.text(`CPF: ${customer.cpf}`, margin, yPos);
          yPos += 5;
        }
        
        const address = customer.address ? 
          `${customer.address}, ${customer.city || ''} - ${customer.state || ''}` : 
          'Não informado';
        doc.text(`Endereço: ${address}`, margin, yPos);
        yPos += 5;
        
        if (customer.zip_code) {
          doc.text(`CEP: ${customer.zip_code}`, margin, yPos);
          yPos += 5;
        }
        
        yPos += 5;
      }

      // Forma de pagamento
      doc.setFont("helvetica", "bold");
      doc.text("FORMA DE PAGAMENTO", margin, yPos);
      yPos += 5;
      
      doc.setFont("helvetica", "normal");
      const paymentMethod = quotation.payment_method === 'pix' ? 'PIX' : 
                            quotation.payment_method === 'credit_card' ? 'Cartão de Crédito' : 
                            quotation.payment_method === 'boleto' ? 'Boleto Bancário' : 
                            'Não especificado';
      
      doc.text(paymentMethod, margin, yPos);
      yPos += 10;

      // Lista de produtos
      doc.setFont("helvetica", "bold");
      doc.text("PRODUTOS", margin, yPos);
      yPos += 7;

      // Usando autoTable para criar uma tabela de produtos
      const tableData = enhancedItems.map((item: any) => [
        item.product_name || "Produto sem nome",
        item.quantity.toString(),
        formatCurrency(item.unit_price),
        formatCurrency(item.total_price || (item.unit_price * item.quantity))
      ]);

      (doc as any).autoTable({
        startY: yPos,
        head: [['Produto', 'Qtd', 'Preço Unit.', 'Total']],
        body: tableData,
        margin: { left: margin, right: margin },
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        tableWidth: 'auto',
        styles: { overflow: 'linebreak', cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' }
        }
      });

      // Atualizar a posição Y após a tabela
      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Resumo de valores
      const rightAlign = pageWidth - margin;
      
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", rightAlign - 70, yPos);
      doc.text(formatCurrency(Number(quotation.subtotal_amount) || 0), rightAlign, yPos, { align: "right" });
      yPos += 7;
      
      if (quotation.discount_amount > 0) {
        doc.text(`Desconto${quotation.discount_type === 'percentage' ? ' (%)' : ''}:`, rightAlign - 70, yPos);
        doc.text(`-${formatCurrency(Number(quotation.discount_amount) || 0)}`, rightAlign, yPos, { align: "right" });
        yPos += 7;
      }

      // Adicionar informações de frete
      if (quotation.shipping_info && quotation.shipping_info.cost) {
        doc.text("Frete:", rightAlign - 70, yPos);
        doc.text(formatCurrency(Number(quotation.shipping_info.cost)), rightAlign, yPos, { align: "right" });
        yPos += 7;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL:", rightAlign - 70, yPos);
      doc.text(formatCurrency(Number(quotation.total_amount) || 0), rightAlign, yPos, { align: "right" });
      yPos += 15;

      // Observações (se houver)
      if (quotation.notes) {
        doc.setFont("helvetica", "bold");
        doc.text("OBSERVAÇÕES:", margin, yPos);
        yPos += 5;
        
        doc.setFont("helvetica", "normal");
        const notes = doc.splitTextToSize(quotation.notes, pageWidth - (margin * 2));
        doc.text(notes, margin, yPos);
        yPos += (notes.length * 5) + 10;
      }

      // Rodapé
      const currentDate = new Date().toLocaleDateString('pt-BR');
      doc.setFontSize(8);
      doc.text(`Documento gerado em ${currentDate}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      doc.text("Bone Heal - Materiais Avançados para Regeneração Óssea", pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });

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
