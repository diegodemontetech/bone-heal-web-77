
import { jsPDF } from "jspdf";

export const addHeader = (doc: jsPDF, pageWidth: number, yPos: number): number => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BONE HEAL", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;
  
  doc.setFontSize(14);
  doc.text("ORÇAMENTO", pageWidth / 2, yPos, { align: "center" });
  
  return yPos + 15;
};
