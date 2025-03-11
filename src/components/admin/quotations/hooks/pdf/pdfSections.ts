
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";
import "jspdf-autotable";

export const addHeader = (doc: jsPDF, pageWidth: number, yPos: number): number => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BONE HEAL", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;
  
  doc.setFontSize(14);
  doc.text("ORÇAMENTO", pageWidth / 2, yPos, { align: "center" });
  
  return yPos + 15;
};

export const addQuotationInfo = (doc: jsPDF, quotation: any, margin: number, yPos: number): number => {
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Nº do Orçamento: ${quotation.id.substring(0, 8)}`, margin, yPos);
  yPos += 5;
  
  doc.text(`Data: ${new Date(quotation.created_at).toLocaleDateString('pt-BR')}`, margin, yPos);
  yPos += 5;
  
  doc.text(`Validade: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`, margin, yPos);
  
  return yPos + 10;
};

export const addCustomerInfo = (doc: jsPDF, customer: any, margin: number, yPos: number): number => {
  if (!customer) return yPos;

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
  
  return yPos + 5;
};

export const addPaymentInfo = (doc: jsPDF, paymentMethod: string, margin: number, yPos: number): number => {
  doc.setFont("helvetica", "bold");
  doc.text("FORMA DE PAGAMENTO", margin, yPos);
  yPos += 5;
  
  doc.setFont("helvetica", "normal");
  const paymentDisplay = paymentMethod === 'pix' ? 'PIX' : 
                        paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                        paymentMethod === 'boleto' ? 'Boleto Bancário' : 
                        'Não especificado';
  
  doc.text(paymentDisplay, margin, yPos);
  
  return yPos + 10;
};

export const addProductsTable = (doc: jsPDF, items: any[], margin: number, yPos: number): number => {
  doc.setFont("helvetica", "bold");
  doc.text("PRODUTOS", margin, yPos);
  yPos += 7;

  const tableData = items.map((item: any) => [
    item.product_name || "Produto sem nome",
    item.quantity.toString(),
    formatCurrency(item.unit_price),
    formatCurrency(item.total_price)
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

  return (doc as any).lastAutoTable.finalY + 10;
};

export const addSummary = (
  doc: jsPDF, 
  subtotal: number, 
  discount: number, 
  shipping: number, 
  total: number,
  pageWidth: number,
  margin: number,
  yPos: number
): number => {
  const rightAlign = pageWidth - margin;
  
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", rightAlign - 70, yPos);
  doc.text(formatCurrency(subtotal), rightAlign, yPos, { align: "right" });
  yPos += 7;
  
  if (discount > 0) {
    doc.text("Desconto:", rightAlign - 70, yPos);
    doc.text(`-${formatCurrency(discount)}`, rightAlign, yPos, { align: "right" });
    yPos += 7;
  }

  if (shipping > 0) {
    doc.text("Frete:", rightAlign - 70, yPos);
    doc.text(formatCurrency(shipping), rightAlign, yPos, { align: "right" });
    yPos += 7;
  }
  
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", rightAlign - 70, yPos);
  doc.text(formatCurrency(total), rightAlign, yPos, { align: "right" });
  
  return yPos + 15;
};

export const addNotes = (doc: jsPDF, notes: string | null, margin: number, pageWidth: number, yPos: number): number => {
  if (!notes) return yPos;

  doc.setFont("helvetica", "bold");
  doc.text("OBSERVAÇÕES:", margin, yPos);
  yPos += 5;
  
  doc.setFont("helvetica", "normal");
  const wrappedNotes = doc.splitTextToSize(notes, pageWidth - (margin * 2));
  doc.text(wrappedNotes, margin, yPos);
  
  return yPos + (wrappedNotes.length * 5) + 10;
};

export const addFooter = (doc: jsPDF, pageWidth: number) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(8);
  doc.text(`Documento gerado em ${currentDate}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
  doc.text("Bone Heal - Materiais Avançados para Regeneração Óssea", pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });
};
