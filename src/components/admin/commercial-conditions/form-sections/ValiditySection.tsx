
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ValiditySectionProps {
  validUntil: string;
  paymentMethod: string;
  onValidUntilChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

const ValiditySection = ({
  validUntil,
  paymentMethod,
  onValidUntilChange,
  onPaymentMethodChange
}: ValiditySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="valid_until">Válido até (deixe em branco para validade ilimitada)</Label>
        <Input
          id="valid_until"
          type="datetime-local"
          value={validUntil}
          onChange={(e) => onValidUntilChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Método de Pagamento (deixe em branco para todos)</Label>
        <Select
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Qualquer método de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer método</SelectItem>
            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ValiditySection;
