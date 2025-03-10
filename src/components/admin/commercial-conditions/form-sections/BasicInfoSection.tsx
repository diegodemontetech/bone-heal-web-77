
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Condição</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Desconto para PIX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva a condição comercial"
          rows={2}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
