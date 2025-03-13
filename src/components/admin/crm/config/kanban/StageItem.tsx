
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface StageItemProps {
  stage: {
    id: string;
    name: string;
    color: string;
    department: string;
    order: number;
  };
  onEdit: (stage: any) => void;
  onDelete: (id: string) => void;
}

export const StageItem = ({ stage, onEdit, onDelete }: StageItemProps) => {
  return (
    <TableRow key={stage.id}>
      <TableCell>{stage.order}</TableCell>
      <TableCell className="font-medium">{stage.name}</TableCell>
      <TableCell>{stage.department}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded" 
            style={{ backgroundColor: stage.color }}
          />
          <span>{stage.color}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(stage)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(stage.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
