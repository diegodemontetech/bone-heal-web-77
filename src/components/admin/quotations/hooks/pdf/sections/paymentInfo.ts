
import { jsPDF } from "jspdf";

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
