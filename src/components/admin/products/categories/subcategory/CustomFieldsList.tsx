
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "./useSubcategoryForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

interface CustomFieldsProps {
  form: UseFormReturn<FormFields>;
}

export const CustomFieldsList = ({ form }: CustomFieldsProps) => {
  const [newFieldName, setNewFieldName] = useState("");
  const defaultFields = form.watch("default_fields") || {};
  
  const addCustomField = () => {
    if (!newFieldName.trim()) return;
    
    // Criar um objeto atualizado com o novo campo
    const updatedFields = {
      ...defaultFields,
      [newFieldName]: ""
    };
    
    // Atualizar o formulário
    form.setValue("default_fields", updatedFields);
    setNewFieldName("");
  };
  
  const removeCustomField = (fieldName: string) => {
    // Criar uma cópia dos campos excluindo o campo a ser removido
    const { [fieldName]: removedField, ...remainingFields } = defaultFields;
    
    // Atualizar o formulário
    form.setValue("default_fields", remainingFields);
  };
  
  const handleFieldValueChange = (fieldName: string, value: string) => {
    // Atualizar apenas o valor do campo específico
    const updatedFields = {
      ...defaultFields,
      [fieldName]: value
    };
    
    // Atualizar o formulário
    form.setValue("default_fields", updatedFields);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Campos Customizados</h3>
      
      {/* Lista de campos existentes */}
      {Object.keys(defaultFields).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(defaultFields).map(([fieldName, fieldValue]) => (
            <div key={fieldName} className="flex items-center gap-2">
              <div className="flex-grow grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">{fieldName}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={fieldValue as string}
                    onChange={(e) => handleFieldValueChange(fieldName, e.target.value)}
                    placeholder="Valor padrão"
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomField(fieldName)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum campo customizado definido ainda.
        </p>
      )}
      
      {/* Formulário para adicionar novo campo */}
      <div className="flex items-end gap-2 pt-2">
        <div className="flex-grow">
          <Label htmlFor="newField" className="text-xs">Novo Campo</Label>
          <Input
            id="newField"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Nome do campo"
            className="text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCustomField}
          disabled={!newFieldName.trim()}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};
