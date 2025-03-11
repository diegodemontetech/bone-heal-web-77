
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
  setDiscountType: (type: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

const DiscountSection = ({
  discountType,
  setDiscountType,
  discount,
  setDiscount,
}: DiscountSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tipo de Desconto</Label>
        <Select value={discountType} onValueChange={setDiscountType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Porcentagem (%)</SelectItem>
            <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="discount">
          {discountType === "percentage" ? "Desconto (%)" : "Desconto (R$)"}
        </Label>
        <Input
          id="discount"
          type="number"
          min="0"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default DiscountSection;
