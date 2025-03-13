
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MaskSectionProps {
  type: string;
  mask: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getDefaultMask: (type: string) => string;
}

export const MaskSection = ({ 
  type, 
  mask, 
  handleInputChange, 
  getDefaultMask 
}: MaskSectionProps) => {
  if (!["phone", "cpf", "cnpj", "cep", "date", "money"].includes(type)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="mask">Máscara</Label>
      <Input
        id="mask"
        name="mask"
        placeholder={getDefaultMask(type)}
        value={mask}
        onChange={handleInputChange}
      />
    </div>
  );
};
