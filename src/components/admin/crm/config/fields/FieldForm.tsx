
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fieldTypes, Field } from "./types";

interface FieldFormProps {
  data: Omit<Field, "id"> & { id?: string };
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

export const FieldForm = ({ data, onChange, onSubmit, onCancel, submitLabel }: FieldFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Campo</Label>
        <Input 
          id="name" 
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ex: Nome, Telefone, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select 
          value={data.type}
          onValueChange={(value) => onChange("type", value)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Select 
          value={data.department}
          onValueChange={(value) => onChange("department", value)}
        >
          <SelectTrigger id="department">
            <SelectValue placeholder="Selecione o departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vendas">Vendas</SelectItem>
            <SelectItem value="Suporte">Suporte</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="required"
          checked={data.required}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            onChange("required", isChecked);
          }}
        />
        <Label htmlFor="required" className="cursor-pointer">Obrigatório</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showInCard"
          checked={data.showInCard}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            onChange("showInCard", isChecked);
          }}
        />
        <Label htmlFor="showInCard" className="cursor-pointer">Exibir no cartão</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showInKanban"
          checked={data.showInKanban}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            onChange("showInKanban", isChecked);
          }}
        />
        <Label htmlFor="showInKanban" className="cursor-pointer">Exibir no kanban</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
