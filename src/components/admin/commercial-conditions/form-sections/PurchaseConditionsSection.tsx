
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PurchaseConditionsSectionProps {
  minAmount: string | number | null;
  minItems: string | number | null;
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
    <div className="space-y-4">
      <h3 className="text-base font-medium">Condições de Compra</h3>
      
      <div className="space-y-2">
        <Label htmlFor="min_amount">Valor Mínimo de Compra (R$)</Label>
        <Input
          id="min_amount"
          type="number"
          value={minAmount || ""}
          onChange={(e) => onMinAmountChange(e.target.value)}
          min={0}
          step="0.01"
          placeholder="Sem valor mínimo"
        />
        <p className="text-sm text-muted-foreground">
          Deixe em branco para não exigir valor mínimo
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="min_items">Quantidade Mínima de Itens</Label>
        <Input
          id="min_items"
          type="number"
          value={minItems || ""}
          onChange={(e) => onMinItemsChange(e.target.value)}
          min={1}
          placeholder="Sem quantidade mínima"
        />
        <p className="text-sm text-muted-foreground">
          Deixe em branco para não exigir quantidade mínima
        </p>
      </div>
    </div>
  );
};

export default PurchaseConditionsSection;
