
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
  paymentMethod: string | null;
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
    <div className="space-y-4">
      <h3 className="text-base font-medium">Validade e Forma de Pagamento</h3>
      
      <div className="space-y-2">
        <Label htmlFor="valid_until">Válido até</Label>
        <Input
          id="valid_until"
          type="datetime-local"
          value={validUntil}
          onChange={(e) => onValidUntilChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Deixe em branco para validade permanente
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment_method">Método de Pagamento</Label>
        <Select
          value={paymentMethod || ""}
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
        <p className="text-sm text-muted-foreground">
          Condicionar desconto a método de pagamento específico
        </p>
      </div>
    </div>
  );
};

export default ValiditySection;
