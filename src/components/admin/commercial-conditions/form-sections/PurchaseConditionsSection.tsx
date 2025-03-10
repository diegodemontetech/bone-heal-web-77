
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PurchaseConditionsSectionProps {
  minAmount: string;
  minItems: string;
  onMinAmountChange: (value: string) => void;
  onMinItemsChange: (value: string) => void;
}

const PurchaseConditionsSection = ({
  minAmount,
  minItems,
  onMinAmountChange,
  onMinItemsChange
}: PurchaseConditionsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="min_amount">Valor Mínimo da Compra (deixe em branco se não houver)</Label>
        <Input
          id="min_amount"
          type="number"
          value={minAmount}
          onChange={(e) => onMinAmountChange(e.target.value)}
          min={0}
          step="0.01"
          placeholder="Sem valor mínimo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_items">Quantidade Mínima de Itens (deixe em branco se não houver)</Label>
        <Input
          id="min_items"
          type="number"
          value={minItems}
          onChange={(e) => onMinItemsChange(e.target.value)}
          min={1}
          placeholder="Sem quantidade mínima"
        />
      </div>
    </div>
  );
};

export default PurchaseConditionsSection;
