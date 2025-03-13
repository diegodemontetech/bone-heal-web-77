
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fieldTypes } from "./fieldTypes";
import { FieldFormData } from "./types";

interface FieldFormProps {
  formData: FieldFormData;
  currentField: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  getDefaultMask: (type: string) => string;
}

export const FieldForm = ({
  formData,
  currentField,
  handleInputChange,
  handleSwitchChange,
  handleSelectChange,
  getDefaultMask
}: FieldFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Interno</Label>
          <Input
            id="name"
            name="name"
            placeholder="nome_campo"
            value={formData.name}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Usado internamente (sem espaços)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Rótulo</Label>
          <Input
            id="label"
            name="label"
            placeholder="Nome visível"
            value={formData.label}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Texto exibido no formulário
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Campo</Label>
        <Select
          value={formData.type}
          onValueChange={value => handleSelectChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {["select", "radio", "checkbox"].includes(formData.type) && (
        <div className="space-y-2">
          <Label htmlFor="options">Opções</Label>
          <Textarea
            id="options"
            name="options"
            placeholder="Opção 1, Opção 2, Opção 3"
            value={formData.options}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Separe as opções por vírgula
          </p>
        </div>
      )}

      {["phone", "cpf", "cnpj", "cep", "date", "money"].includes(formData.type) && (
        <div className="space-y-2">
          <Label htmlFor="mask">Máscara</Label>
          <Input
            id="mask"
            name="mask"
            placeholder={getDefaultMask(formData.type)}
            value={formData.mask}
            onChange={handleInputChange}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="default_value">Valor Padrão</Label>
        <Input
          id="default_value"
          name="default_value"
          placeholder="Valor padrão (opcional)"
          value={formData.default_value}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={formData.required}
          onCheckedChange={checked => handleSwitchChange("required", checked)}
        />
        <Label htmlFor="required" className="cursor-pointer">Campo obrigatório</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="display_in_kanban"
          checked={formData.display_in_kanban}
          onCheckedChange={checked => handleSwitchChange("display_in_kanban", checked)}
        />
        <Label htmlFor="display_in_kanban" className="cursor-pointer">Exibir no Kanban</Label>
      </div>
    </div>
  );
};
