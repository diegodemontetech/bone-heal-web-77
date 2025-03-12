
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AutomationFlow } from "@/hooks/use-automation-flow";
import FlowTableRow from "./FlowTableRow";

interface FlowsTableProps {
  flows: AutomationFlow[];
  onSelectFlow: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<any>;
  onDuplicate: (id: string) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
}

const FlowsTable = ({
  flows,
  onSelectFlow,
  onToggleStatus,
  onDuplicate,
  onDelete,
}: FlowsTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Fluxo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flows.map((flow) => (
            <FlowTableRow
              key={flow.id}
              flow={flow}
              onSelectFlow={onSelectFlow}
              onToggleStatus={onToggleStatus}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlowsTable;
