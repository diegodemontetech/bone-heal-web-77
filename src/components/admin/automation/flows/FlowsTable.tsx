
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FlowTableRow from "./FlowTableRow";
import { Flow } from "@/hooks/use-automation-flows";

interface FlowsTableProps {
  flows: Flow[];
  onSelectFlow: (flowId: string) => void;
  onToggleStatus: (flow: Flow) => Promise<boolean>;
  onDuplicate: (flow: Flow) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
}

const FlowsTable = ({
  flows,
  onSelectFlow,
  onToggleStatus,
  onDuplicate,
  onDelete
}: FlowsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Última Atualização</TableHead>
          <TableHead className="text-right">Ações</TableHead>
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
  );
};

export default FlowsTable;
