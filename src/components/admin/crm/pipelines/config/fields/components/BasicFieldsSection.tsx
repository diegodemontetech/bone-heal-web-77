
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldFormData } from "../types";

interface BasicFieldsSectionProps {
  formData: FieldFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicFieldsSection = ({ formData, handleInputChange }: BasicFieldsSectionProps) => {
  return (
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
  );
};
