
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { CustomFieldsProps } from "../types";

export function CustomFieldsList({ fields, onFieldChange, onAddField }: CustomFieldsProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">Campos Personalizados</p>
      <p className="text-sm text-muted-foreground mb-4">
        Adicione campos personalizados para esta subcategoria.
      </p>
      
      {Object.entries(fields).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2 mt-2">
          <FormLabel className="w-1/4">{key}</FormLabel>
          <Input
            className="w-3/4"
            value={typeof value === 'string' ? value : JSON.stringify(value)}
            onChange={(e) => onFieldChange(key, e.target.value)}
          />
        </div>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddField}
        className="mt-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Campo
      </Button>
    </div>
  );
}
