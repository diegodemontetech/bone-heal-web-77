
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Play, Copy, Trash2 } from "lucide-react";
import { Flow } from "@/hooks/use-automation-flows";

interface FlowTableRowProps {
  flow: Flow;
  onSelectFlow: (flowId: string) => void;
  onToggleStatus: (flow: Flow) => Promise<boolean>;
  onDuplicate: (flow: Flow) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
}

const FlowTableRow = ({
  flow,
  onSelectFlow,
  onToggleStatus,
  onDuplicate,
  onDelete
}: FlowTableRowProps) => {
  return (
    <TableRow key={flow.id}>
      <TableCell className="font-medium">{flow.name}</TableCell>
      <TableCell className="max-w-[200px] truncate">{flow.description}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs ${flow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {flow.is_active ? 'Ativo' : 'Inativo'}
        </span>
      </TableCell>
      <TableCell>{format(new Date(flow.updated_at), 'dd/MM/yyyy HH:mm')}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectFlow(flow.id)}
            title="Editar fluxo"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => onToggleStatus(flow)}
            title={flow.is_active ? "Desativar fluxo" : "Ativar fluxo"}
          >
            <Play className={`h-4 w-4 ${flow.is_active ? 'text-green-600' : 'text-gray-400'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(flow)}
            title="Duplicar fluxo"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(flow.id)}
            className="text-red-500 hover:text-red-700"
            title="Excluir fluxo"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FlowTableRow;
