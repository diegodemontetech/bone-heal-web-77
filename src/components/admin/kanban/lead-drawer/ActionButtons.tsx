
import { Button } from "@/components/ui/button";
import { Save, Trash, MessageSquare, History, X } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ActionButtons = ({ onSave, onDelete, onClose }: ActionButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
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
  );
};
