
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";

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
