
import { useCallback } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { parseJsonArray, parseJsonObject } from "@/utils/supabaseJsonUtils";

// Função para gerar PDF de uma cotação
export const usePdfGenerator = () => {
  const generatePdf = useCallback((quotation) => {
    if (!quotation) return null;

    // Criar nova instância de PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Extrair dados
    const quotationData = quotation;
    const customerData = quotationData.customer_data || {};
    const products = parseJsonArray(quotationData.products, []);
    const notes = quotationData.notes || '';
    const shipping = quotationData.shipping_method 
      ? parseJsonObject(quotationData.shipping_method, {})
      : {};
    
    // Adicionar cabeçalho da empresa
    doc.setFontSize(20);
    doc.text("Boneheal", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Cotação de Produtos", pageWidth / 2, 25, { align: "center" });
    
    // Informações da cotação
    doc.setFontSize(10);
    doc.text(`Número: #${quotationData.id.substring(0, 8)}`, 14, 35);
    doc.text(`Data: ${new Date(quotationData.created_at).toLocaleDateString('pt-BR')}`, 14, 40);
    doc.text(`Status: ${quotationData.status}`, 14, 45);
    
    // Informações do cliente
    doc.setFontSize(12);
    doc.text("Dados do Cliente", 14, 55);
    doc.setFontSize(10);
    doc.text(`Nome: ${customerData.name || 'N/A'}`, 14, 65);
    doc.text(`Email: ${customerData.email || 'N/A'}`, 14, 70);
    doc.text(`Telefone: ${customerData.phone || 'N/A'}`, 14, 75);
    
    // Produtos
    doc.setFontSize(12);
    doc.text("Produtos", 14, 90);
    
    // Tabela de produtos
    const tableColumn = ["Produto", "Quantidade", "Preço Unitário", "Total"];
    const tableRows = [];
    
    let subtotal = 0;
    
    products.forEach(product => {
      const productTotal = product.quantity * product.price;
      subtotal += productTotal;
      
      tableRows.push([
        product.name,
        product.quantity.toString(),
        `R$ ${product.price.toFixed(2)}`,
        `R$ ${productTotal.toFixed(2)}`
      ]);
    });
    
    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Obter a posição Y após a tabela
    // @ts-ignore
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Informações de frete
    doc.setFontSize(12);
    doc.text("Informações de Envio", 14, finalY);
    doc.setFontSize(10);
    
    if (shipping && typeof shipping === 'object') {
      const shippingCost = (shipping as any).cost || 0;
      doc.text(`Método: ${(shipping as any).name || 'N/A'}`, 14, finalY + 10);
      doc.text(`Custo: R$ ${typeof shippingCost === 'number' ? shippingCost.toFixed(2) : '0.00'}`, 14, finalY + 15);
      doc.text(`Prazo: ${(shipping as any).delivery_time || 'N/A'}`, 14, finalY + 20);
    } else {
      doc.text(`Método: N/A`, 14, finalY + 10);
      doc.text(`Custo: R$ 0.00`, 14, finalY + 15);
      doc.text(`Prazo: N/A`, 14, finalY + 20);
    }
    
    // Observações
    doc.setFontSize(12);
    doc.text("Observações", 14, finalY + 35);
    doc.setFontSize(10);
    
    // Quebra o texto em múltiplas linhas
    const splitNotes = doc.splitTextToSize(notes, pageWidth - 30);
    doc.text(splitNotes, 14, finalY + 45);
    
    // Total
    const discount = quotationData.discount || 0;
    const shippingCost = shipping && typeof shipping === 'object' ? (shipping as any).cost || 0 : 0;
    const total = subtotal - discount + shippingCost;
    
    const totalY = finalY + 45 + (splitNotes.length * 5) + 15;
    
    doc.setFontSize(12);
    doc.text("Resumo", pageWidth - 60, totalY);
    doc.setFontSize(10);
    doc.text(`Subtotal: R$ ${subtotal.toFixed(2)}`, pageWidth - 60, totalY + 10);
    doc.text(`Desconto: R$ ${discount.toFixed(2)}`, pageWidth - 60, totalY + 15);
    doc.text(`Frete: R$ ${shippingCost.toFixed(2)}`, pageWidth - 60, totalY + 20);
    doc.setFontSize(12);
    doc.text(`Total: R$ ${total.toFixed(2)}`, pageWidth - 60, totalY + 30);
    
    // Rodapé
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.text("Este documento é apenas uma cotação e não representa uma venda finalizada.", pageWidth / 2, pageHeight - 10, { align: "center" });
    
    return doc;
  }, []);
  
  return { generatePdf };
};
