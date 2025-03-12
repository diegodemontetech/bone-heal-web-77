
import { jsPDF } from "jspdf";

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
