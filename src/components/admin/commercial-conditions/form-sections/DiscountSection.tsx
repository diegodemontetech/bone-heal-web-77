
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiscountSectionProps {
  discountType: string;
  discountValue: string;
  onDiscountTypeChange: (value: string) => void;
  onDiscountValueChange: (value: string) => void;
}

const DiscountSection = ({
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange
}: DiscountSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="discount_type">Tipo de Desconto</Label>
        <Select
          value={discountType}
          onValueChange={onDiscountTypeChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentual</SelectItem>
            <SelectItem value="fixed">Valor Fixo</SelectItem>
            <SelectItem value="shipping">Frete Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {discountType !== "shipping" && (
        <div className="space-y-2">
          <Label htmlFor="discount_value">
            {discountType === "percentage" ? "Valor do Desconto (%)" : "Valor do Desconto (R$)"}
          </Label>
          <Input
            id="discount_value"
            type="number"
            required
            value={discountValue}
            onChange={(e) => onDiscountValueChange(e.target.value)}
            step={discountType === "percentage" ? "1" : "0.01"}
            min={0}
            max={discountType === "percentage" ? 100 : undefined}
            placeholder={discountType === "percentage" ? "Ex: 10" : "Ex: 50.00"}
          />
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
