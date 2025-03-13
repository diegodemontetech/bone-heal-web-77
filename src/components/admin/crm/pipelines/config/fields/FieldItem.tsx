
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { fieldTypes } from "./fieldTypes";
import { FieldItemProps } from "./types";

export const FieldItem = ({ field, onEdit, onDelete }: FieldItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10">
      <div className="flex-1">
        <div className="font-medium">{field.label}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{field.name}</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
            {fieldTypes.find(t => t.value === field.type)?.label || field.type}
          </span>
          {field.required && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
              Obrigatório
            </span>
          )}
          {field.display_in_kanban && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Exibir no Kanban
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(field)}
        >
          Editar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(field.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
