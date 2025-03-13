
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fieldTypes } from "../fieldTypes";

interface FieldTypeSectionProps {
  type: string;
  onTypeChange: (value: string) => void;
}

export const FieldTypeSection = ({ type, onTypeChange }: FieldTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Tipo de Campo</Label>
      <Select
        value={type}
        onValueChange={onTypeChange}
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
  );
};
