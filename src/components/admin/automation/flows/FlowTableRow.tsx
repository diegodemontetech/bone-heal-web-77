
import { TableCell, TableRow } from "@/components/ui/table";
import { AutomationFlow } from "@/types/automation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreHorizontal, Play, Copy, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

interface FlowTableRowProps {
  flow: AutomationFlow;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onExecute: (id: string) => void;
}

const FlowTableRow = ({
  flow,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onExecute,
}: FlowTableRowProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(flow.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{flow.name}</div>
        <div className="text-sm text-muted-foreground">
          Criado em {formatDate(flow.created_at)}
        </div>
      </TableCell>
      <TableCell>{flow.description || "Sem descrição"}</TableCell>
      <TableCell>
        <Badge
          variant={flow.is_active ? "success" : "secondary"}
          className="cursor-pointer"
          onClick={() => onToggleStatus(flow.id, !flow.is_active)}
        >
          {flow.is_active ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExecute(flow.id)}
          disabled={!flow.is_active}
        >
          <Play className="h-4 w-4 mr-1" />
          Executar
        </Button>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(flow.id)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(flow.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default FlowTableRow;
