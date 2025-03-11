
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const BasicInfoSection = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Informações Básicas</h3>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Condição Comercial</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Desconto para Clínicas"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descrição da condição comercial"
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
