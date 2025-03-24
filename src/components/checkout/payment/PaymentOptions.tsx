
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import OpcoesCartao from "./OpcoesCartao";
import OpcaoPix from "./OpcaoPix";
import OpcaoBoleto from "./OpcaoBoleto";
import { CreditCard, QrCode, FileText, BadgeInfo } from "lucide-react";

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
    <div className="rounded-lg shadow-sm border bg-white">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <h4 className="font-medium text-primary flex items-center gap-2">
          <BadgeInfo className="h-4 w-4" />
          Forma de Pagamento
        </h4>
      </div>
      
      <div className="p-4">
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          className="gap-4"
        >
          <div className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors ${paymentMethod === 'credit' ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-gray-200'}`}>
            <RadioGroupItem value="credit" id="credit" className={paymentMethod === 'credit' ? 'text-blue-600' : ''} />
            <Label htmlFor="credit" className="flex-1 cursor-pointer pt-0.5">
              <OpcoesCartao 
                isSelected={paymentMethod === 'credit'} 
                total={total} 
              />
            </Label>
          </div>

          <div className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors ${paymentMethod === 'pix' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-gray-200'}`}>
            <RadioGroupItem value="pix" id="pix" className={paymentMethod === 'pix' ? 'text-green-600' : ''} />
            <Label htmlFor="pix" className="flex-1 cursor-pointer pt-0.5">
              <OpcaoPix 
                isSelected={paymentMethod === 'pix'} 
                total={total}
                pixCode={pixCode}
                pixQrCodeBase64={pixQrCodeBase64}
              />
            </Label>
          </div>

          <div className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors ${paymentMethod === 'boleto' ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50 border-gray-200'}`}>
            <RadioGroupItem value="boleto" id="boleto" className={paymentMethod === 'boleto' ? 'text-orange-600' : ''} />
            <Label htmlFor="boleto" className="flex-1 cursor-pointer pt-0.5">
              <OpcaoBoleto 
                isSelected={paymentMethod === 'boleto'} 
                total={total}
                boletoUrl={boletoUrl}
              />
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PaymentOptions;
