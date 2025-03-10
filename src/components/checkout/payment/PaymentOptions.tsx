
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, QrCode } from "lucide-react";

interface PaymentOptionsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  total: number;
}

const PaymentOptions = ({ paymentMethod, setPaymentMethod, total }: PaymentOptionsProps) => {
  const pixDiscount = total * 0.05; // 5% de desconto no PIX
  
  const calculateInstallments = (total: number) => {
    const installments = [];
    for (let i = 1; i <= 12; i++) {
      const value = total / i;
      installments.push({
        number: i,
        value,
        total: total
      });
    }
    return installments;
  };
  
  const installments = calculateInstallments(total);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h4 className="font-medium text-primary border-b pb-2">Forma de Pagamento</h4>
      
      <RadioGroup 
        value={paymentMethod} 
        onValueChange={setPaymentMethod}
        className="gap-4"
      >
        <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="credit" id="credit" />
          <Label htmlFor="credit" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Cartão de Crédito</span>
            </div>
            {paymentMethod === 'credit' && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                {installments.slice(0, 6).map((installment) => (
                  <div key={installment.number} className="flex justify-between">
                    <span>{installment.number}x de</span>
                    <span className="font-medium">R$ {installment.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="pix" id="pix" />
          <Label htmlFor="pix" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-primary" />
              <span>PIX</span>
              <span className="text-green-600 text-sm font-medium ml-auto">
                5% de desconto
              </span>
            </div>
            {paymentMethod === 'pix' && (
              <div className="mt-2 text-sm">
                <div className="p-2 bg-green-50 rounded border border-green-100">
                  <div className="flex justify-between">
                    <span>Total com desconto:</span>
                    <span className="text-green-600 font-medium">
                      R$ {(total - pixDiscount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Você economiza R$ {pixDiscount.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="boleto" id="boleto" />
          <Label htmlFor="boleto" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span>Boleto Bancário</span>
            </div>
            {paymentMethod === 'boleto' && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  O boleto vence em 3 dias úteis
                </p>
              </div>
            )}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentOptions;
