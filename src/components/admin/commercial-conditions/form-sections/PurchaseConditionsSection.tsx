
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseConditionsSectionProps {
  minAmount: string | null;
  minItems: string | null;
  paymentMethod: string | null;
  onMinAmountChange: (value: string) => void;
  onMinItemsChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

const PurchaseConditionsSection = ({
  minAmount,
  minItems,
  paymentMethod,
  onMinAmountChange,
  onMinItemsChange,
  onPaymentMethodChange
}: PurchaseConditionsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Condições de Compra</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_amount">Valor Mínimo (R$)</Label>
          <Input
            id="min_amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex: 100.00"
            value={minAmount || ""}
            onChange={(e) => onMinAmountChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="min_items">Quantidade Mínima de Itens</Label>
          <Input
            id="min_items"
            type="number"
            min="0"
            step="1"
            placeholder="Ex: 5"
            value={minItems || ""}
            onChange={(e) => onMinItemsChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment_method">Método de Pagamento</Label>
        <Select
          value={paymentMethod || "all"}
          onValueChange={onPaymentMethodChange}
        >
          <SelectTrigger id="payment_method">
            <SelectValue placeholder="Selecione um método de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os métodos</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PurchaseConditionsSection;
