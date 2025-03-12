
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FlowTableRow from "./FlowTableRow";
import { AutomationFlow } from "@/types/automation";

interface FlowsTableProps {
  flows: AutomationFlow[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onExecute: (id: string) => void;
}

const FlowsTable = ({
  flows,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onExecute,
}: FlowsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flows.map((flow) => (
            <FlowTableRow
              key={flow.id}
              flow={flow}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onExecute={onExecute}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlowsTable;
