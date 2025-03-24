
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ValiditySectionProps {
  validFrom: string | null;
  validUntil: string | null;
  onValidFromChange: (value: string) => void;
  onValidUntilChange: (value: string) => void;
}

const ValiditySection = ({
  validFrom,
  validUntil,
  onValidFromChange,
  onValidUntilChange
}: ValiditySectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Período de Validade</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valid_from">Válido a partir de</Label>
          <Input
            id="valid_from"
            type="date"
            value={validFrom || ""}
            onChange={(e) => onValidFromChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="valid_until">Válido até</Label>
          <Input
            id="valid_until"
            type="date"
            value={validUntil || ""}
            onChange={(e) => onValidUntilChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ValiditySection;
