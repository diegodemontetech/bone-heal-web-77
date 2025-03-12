
import { jsPDF } from "jspdf";

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
