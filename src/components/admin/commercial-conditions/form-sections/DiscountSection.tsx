
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
    <div className="space-y-4">
      <h3 className="text-base font-medium">Configuração de Desconto</h3>
      
      <div className="space-y-2">
        <Label htmlFor="discount_type">Tipo de Desconto</Label>
        <Select
          value={discountType}
          onValueChange={onDiscountTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de desconto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentual (%)</SelectItem>
            <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
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
            value={discountValue}
            onChange={(e) => onDiscountValueChange(e.target.value)}
            min={0}
            step={discountType === "percentage" ? "1" : "0.01"}
            max={discountType === "percentage" ? 100 : undefined}
            required
          />
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
