
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethodSection = ({ 
  paymentMethod, 
  setPaymentMethod 
}: PaymentMethodSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Forma de Pagamento</Label>
      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a forma de pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pix">PIX</SelectItem>
          <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
          <SelectItem value="boleto">Boleto Bancário</SelectItem>
          <SelectItem value="transfer">Transferência Bancária</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
