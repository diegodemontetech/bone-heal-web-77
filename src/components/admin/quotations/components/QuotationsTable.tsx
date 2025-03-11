
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import CustomerInfo from "./CustomerInfo";
import QuotationActions from "./QuotationActions";
import StatusBadge from "./StatusBadge";
import { Quotation } from "../hooks/useQuotationsQuery";

interface QuotationsTableProps {
  quotations: Quotation[];
  onSendEmail: (quotationId: string, customerEmail: string) => void;
  onGeneratePdf: (quotationId: string) => void;
  onConvertToOrder: (quotationId: string) => void;
  onShareWhatsApp: (quotationId: string) => void;
}

const QuotationsTable = ({ 
  quotations, 
  onSendEmail, 
  onGeneratePdf,
  onConvertToOrder,
  onShareWhatsApp
}: QuotationsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotations.length > 0 ? (
          quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell className="font-medium">
                {quotation.id.substring(0, 8)}...
              </TableCell>
              <TableCell>
                <CustomerInfo customer={quotation.customer} />
              </TableCell>
              <TableCell>
                {new Date(quotation.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                {formatCurrency(Number(quotation.total_amount))}
              </TableCell>
              <TableCell>
                <StatusBadge status={quotation.status} />
              </TableCell>
              <TableCell>
                <QuotationActions 
                  quotationId={quotation.id}
                  customerEmail={quotation.customer?.email || ""}
                  sentByEmail={quotation.sent_by_email}
                  onSendEmail={onSendEmail}
                  onGeneratePdf={onGeneratePdf}
                  onConvertToOrder={onConvertToOrder}
                  onShareWhatsApp={onShareWhatsApp}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Nenhum orçamento encontrado para esta busca.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default QuotationsTable;
