
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeadRow from "./LeadRow";
import { Lead } from "@/types/leads";

interface LeadsTableProps {
  leads: Lead[] | undefined;
  onUpdateStatus: (leadId: string, status: string) => void;
  onConvertToCRM: (lead: Lead) => void;
}

const LeadsTable = ({ leads, onUpdateStatus, onConvertToCRM }: LeadsTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Data</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum lead encontrado
              </TableCell>
            </TableRow>
          ) : (
            leads?.map((lead) => (
              <LeadRow 
                key={lead.id}
                lead={lead}
                onUpdateStatus={onUpdateStatus}
                onConvertToCRM={onConvertToCRM}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
