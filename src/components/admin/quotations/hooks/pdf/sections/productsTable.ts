
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";
import "jspdf-autotable";

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
