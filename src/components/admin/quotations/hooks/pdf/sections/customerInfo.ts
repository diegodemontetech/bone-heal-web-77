
import { jsPDF } from "jspdf";

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
