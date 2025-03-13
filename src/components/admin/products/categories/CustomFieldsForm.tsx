
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit } from "lucide-react";

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
}

interface CustomFieldsFormProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export function CustomFieldsForm({ fields, onChange }: CustomFieldsFormProps) {
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [fieldRequired, setFieldRequired] = useState(false);

  const addField = () => {
    if (!fieldName || !fieldLabel) return;

    if (editingField) {
      // Atualizar campo existente
      const updatedFields = fields.map(field => 
        field.id === editingField.id 
          ? { ...field, name: fieldName, label: fieldLabel, type: fieldType, required: fieldRequired }
          : field
      );
      onChange(updatedFields);
    } else {
      // Adicionar novo campo
      const newField: CustomField = {
        id: Date.now().toString(),
        name: fieldName,
        label: fieldLabel,
        type: fieldType,
        required: fieldRequired
      };
      onChange([...fields, newField]);
    }

    resetForm();
  };

  const editField = (field: CustomField) => {
    setEditingField(field);
    setFieldName(field.name);
    setFieldLabel(field.label);
    setFieldType(field.type);
    setFieldRequired(field.required);
  };

  const removeField = (id: string) => {
    onChange(fields.filter(field => field.id !== id));
  };

  const resetForm = () => {
    setEditingField(null);
    setFieldName("");
    setFieldLabel("");
    setFieldType("text");
    setFieldRequired(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campos Personalizados</CardTitle>
          <CardDescription>
            Defina campos adicionais para produtos desta subcategoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Nome do Campo (ID)</Label>
              <Input
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="Ex: material, dimensoes, cor"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Rótulo do Campo</Label>
              <Input
                id="fieldLabel"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                placeholder="Ex: Material, Dimensões, Cor"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fieldType">Tipo do Campo</Label>
              <Select value={fieldType} onValueChange={setFieldType}>
                <SelectTrigger id="fieldType">
                  <SelectValue placeholder="Tipo do campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="select">Lista de Seleção</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mt-auto">
              <input
                type="checkbox"
                id="fieldRequired"
                checked={fieldRequired}
                onChange={(e) => setFieldRequired(e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="fieldRequired">Campo Obrigatório</Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            {editingField && (
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
            <Button onClick={addField}>
              {editingField ? "Atualizar Campo" : "Adicionar Campo"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campos Configurados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <p className="font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {field.name} ({field.type}) {field.required && "• Obrigatório"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => editField(field)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
