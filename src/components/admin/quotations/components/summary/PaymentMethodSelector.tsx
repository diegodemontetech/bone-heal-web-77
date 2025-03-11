
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Forma de Pagamento</Label>
      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a forma de pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pix">PIX (5% de desconto)</SelectItem>
          <SelectItem value="boleto">Boleto Bancário</SelectItem>
          <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentMethodSelector;
