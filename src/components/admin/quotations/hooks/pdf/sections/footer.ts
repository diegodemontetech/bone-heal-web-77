
import { jsPDF } from "jspdf";

export const addFooter = (doc: jsPDF, pageWidth: number) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(8);
  doc.text(`Documento gerado em ${currentDate}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
  doc.text("Bone Heal - Materiais Avançados para Regeneração Óssea", pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });
};
