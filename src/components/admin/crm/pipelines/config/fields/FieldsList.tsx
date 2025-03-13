
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FieldItem } from "./FieldItem";
import { FieldsListProps } from "./types";

export const FieldsList = ({ fields, loading, onOpenDialog, onDeleteField }: FieldsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Nenhum campo personalizado definido</p>
        <Button variant="outline" className="mt-4" onClick={() => onOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Campo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map(field => (
        <FieldItem
          key={field.id}
          field={field}
          onEdit={(field) => onOpenDialog(field)}
          onDelete={onDeleteField}
        />
      ))}
    </div>
  );
};
