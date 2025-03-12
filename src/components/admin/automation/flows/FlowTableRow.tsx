
import { AutomationFlow } from "@/hooks/use-automation-flow";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FlowTableRowProps {
  flow: AutomationFlow;
  onSelectFlow: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<any>;
  onDuplicate: (id: string) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
}

const FlowTableRow = ({
  flow,
  onSelectFlow,
  onToggleStatus,
  onDuplicate,
  onDelete
}: FlowTableRowProps) => {
  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleStatus(flow.id, flow.is_active);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onDuplicate(flow.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o fluxo "${flow.name}"?`)) {
      await onDelete(flow.id);
    }
  };

  return (
    <tr
      onClick={() => onSelectFlow(flow.id)}
      className="cursor-pointer hover:bg-gray-50"
    >
      <td className="px-4 py-3">
        <div className="font-medium">{flow.name}</div>
        <div className="text-sm text-gray-500 truncate max-w-[250px]">
          {flow.description || "Sem descrição"}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${
              flow.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          {flow.is_active ? "Ativo" : "Inativo"}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDistanceToNow(new Date(flow.created_at), {
          addSuffix: true,
          locale: ptBR
        })}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <Switch
            checked={flow.is_active}
            onCheckedChange={() => {}}
            onClick={handleToggleStatus}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDuplicate}
            title="Duplicar fluxo"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Excluir fluxo"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSelectFlow(flow.id);
            }}
            title="Editar fluxo"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default FlowTableRow;
