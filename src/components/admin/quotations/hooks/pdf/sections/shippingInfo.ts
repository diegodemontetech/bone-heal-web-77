
import { jsPDF } from "jspdf";

export const addShippingInfo = (
  doc: jsPDF,
  pageWidth: number,
  yPos: number,
  shippingInfo: any
): number => {
  if (!shippingInfo) return yPos;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMAÇÕES DE FRETE", 14, yPos);
  yPos += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  if (shippingInfo.service) {
    doc.text(`Serviço: ${shippingInfo.service}`, 14, yPos);
    yPos += 5;
  }

  if (shippingInfo.cost !== undefined) {
    doc.text(`Valor: R$ ${shippingInfo.cost.toFixed(2)}`, 14, yPos);
    yPos += 5;
  }

  if (shippingInfo.estimated_days) {
    doc.text(`Prazo estimado: ${shippingInfo.estimated_days} dias úteis`, 14, yPos);
    yPos += 5;
  }

  if (shippingInfo.zip_code) {
    doc.text(`CEP de entrega: ${shippingInfo.zip_code}`, 14, yPos);
    yPos += 5;
  }

  return yPos + 5;
};
