
import { CRMStage } from "@/types/crm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { ColorPickerPopover } from "./ColorPickerPopover";

interface StageItemProps {
  stage: CRMStage;
  provided: any;
  onUpdate: (stage: CRMStage, field: string, value: string) => void;
  onDelete: (stageId: string) => void;
  onEdit?: (stage: CRMStage) => void; // Adicionando onEdit como propriedade opcional
}

export const StageItem = ({ stage, provided, onUpdate, onDelete, onEdit }: StageItemProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="flex items-center space-x-2 p-2 border rounded-md"
    >
      <div {...provided.dragHandleProps} className="cursor-move">
        <div className="h-5 w-5 text-muted-foreground flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 4.625C5.5 4.97018 5.22018 5.25 4.875 5.25C4.52982 5.25 4.25 4.97018 4.25 4.625C4.25 4.27982 4.52982 4 4.875 4C5.22018 4 5.5 4.27982 5.5 4.625ZM5.5 7.625C5.5 7.97018 5.22018 8.25 4.875 8.25C4.52982 8.25 4.25 7.97018 4.25 7.625C4.25 7.27982 4.52982 7 4.875 7C5.22018 7 5.5 7.27982 5.5 7.625ZM4.875 11.25C5.22018 11.25 5.5 10.9702 5.5 10.625C5.5 10.2798 5.22018 10 4.875 10C4.52982 10 4.25 10.2798 4.25 10.625C4.25 10.9702 4.52982 11.25 4.875 11.25ZM10.5 4.625C10.5 4.97018 10.2202 5.25 9.875 5.25C9.52982 5.25 9.25 4.97018 9.25 4.625C9.25 4.27982 9.52982 4 9.875 4C10.2202 4 10.5 4.27982 10.5 4.625ZM9.875 8.25C10.2202 8.25 10.5 7.97018 10.5 7.625C10.5 7.27982 10.2202 7 9.875 7C9.52982 7 9.25 7.27982 9.25 7.625C9.25 7.97018 9.52982 8.25 9.875 8.25ZM10.5 10.625C10.5 10.9702 10.2202 11.25 9.875 11.25C9.52982 11.25 9.25 10.9702 9.25 10.625C9.25 10.2798 9.52982 10 9.875 10C10.2202 10 10.5 10.2798 10.5 10.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
      <Input
        value={stage.name}
        onChange={(e) => onUpdate(stage, "name", e.target.value)}
        className="flex-grow"
      />
      <ColorPickerPopover 
        color={stage.color}
        onChange={(color) => onUpdate(stage, "color", color)}
      />
      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(stage)}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(stage.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
