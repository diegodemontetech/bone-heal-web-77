
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DefaultValueSectionProps {
  defaultValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const DefaultValueSection = ({ defaultValue, handleInputChange }: DefaultValueSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="default_value">Valor Padrão</Label>
      <Input
        id="default_value"
        name="default_value"
        placeholder="Valor padrão (opcional)"
        value={defaultValue}
        onChange={handleInputChange}
      />
    </div>
  );
};
