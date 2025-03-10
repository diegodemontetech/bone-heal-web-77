
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import OpcoesCartao from "./OpcoesCartao";
import OpcaoPix from "./OpcaoPix";
import OpcaoBoleto from "./OpcaoBoleto";

interface PaymentOptionsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  total: number;
  checkoutData: any;
}

const PaymentOptions = ({ paymentMethod, setPaymentMethod, total, checkoutData }: PaymentOptionsProps) => {
  // Extrair dados do PIX
  const pixCode = checkoutData?.point_of_interaction?.transaction_data?.qr_code || "";
  const pixQrCodeBase64 = checkoutData?.point_of_interaction?.transaction_data?.qr_code_base64 || "";
  
  // Extrair URL do boleto
  const boletoUrl = checkoutData?.transaction_details?.external_resource_url || null;
  
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
            <OpcoesCartao 
              isSelected={paymentMethod === 'credit'} 
              total={total} 
            />
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="pix" id="pix" />
          <Label htmlFor="pix" className="flex-1 cursor-pointer">
            <OpcaoPix 
              isSelected={paymentMethod === 'pix'} 
              total={total}
              pixCode={pixCode}
              pixQrCodeBase64={pixQrCodeBase64}
            />
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="boleto" id="boleto" />
          <Label htmlFor="boleto" className="flex-1 cursor-pointer">
            <OpcaoBoleto 
              isSelected={paymentMethod === 'boleto'} 
              total={total}
              boletoUrl={boletoUrl}
            />
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentOptions;
