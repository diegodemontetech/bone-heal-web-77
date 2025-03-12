
import { Button } from "@/components/ui/button";
import { Save, Trash, MessageSquare, History, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
  currentStatus?: string;
}

export const ActionButtons = ({ onSave, onDelete, onClose, onStatusChange, currentStatus }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col pt-4 gap-4">
      {onStatusChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <Select
            value={currentStatus}
            onValueChange={(value) => onStatusChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="contacted">Contatado</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
        <div className="space-x-2">
          <Button variant="ghost" size="icon">
            <History className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
