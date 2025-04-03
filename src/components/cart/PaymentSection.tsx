
import { CreditCard, QrCode, FileText, Copy } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  handleProcessPayment: () => void;
  checkoutLoading: boolean;
  checkoutData: any;
  orderId: string | null;
}

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  handleProcessPayment,
  checkoutLoading,
  checkoutData,
  orderId
}: PaymentSectionProps) => {
  // If we already have payment data (QR code for PIX, etc.), show the corresponding section
  if (checkoutData && paymentMethod === 'pix' && orderId) {
    const pixCode = checkoutData?.point_of_interaction?.transaction_data?.qr_code;
    const pixQrCodeImage = checkoutData?.point_of_interaction?.transaction_data?.qr_code_base64;
    
    if (pixCode) {
      return (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-medium text-lg text-center mb-4">Pagamento PIX</h3>
            
            <div className="flex flex-col items-center mb-4">
              {pixQrCodeImage ? (
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img 
                    src={`data:image/png;base64,${pixQrCodeImage}`} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              <p className="text-sm text-center text-gray-600 mb-4">
                Escaneie o QR Code com o aplicativo do seu banco ou copie e cole o código PIX
              </p>
              
              <div className="flex items-center w-full gap-2 mb-3">
                <Input 
                  value={pixCode} 
                  readOnly 
                  className="text-xs font-mono flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    toast.success("Código PIX copiado!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-center font-medium text-red-500 mt-1">
                Atenção: Este código PIX expira em 30 minutos
              </p>
            </div>
            
            <div className="text-sm text-center text-gray-700 mt-4">
              <p className="font-medium">Pedido #{orderId.substring(0, 8)}</p>
              <p>Assim que recebermos a confirmação do pagamento, seu pedido será processado</p>
            </div>
          </div>
        </div>
      );
    }
  }

  // Default payment method selection
  return (
    <div className="space-y-6">
      <RadioGroup 
        value={paymentMethod} 
        onValueChange={setPaymentMethod}
        className="space-y-3"
      >
        <div className={`relative flex items-start p-4 rounded-lg border ${paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
          <RadioGroupItem value="pix" id="pix" className="mt-1" />
          <Label htmlFor="pix" className="flex-1 ml-3 cursor-pointer">
            <div className="flex items-center mb-1">
              <QrCode className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium">PIX</span>
            </div>
            <p className="text-sm text-gray-500">Pagamento instantâneo. Aprovação em segundos.</p>
          </Label>
        </div>
        
        <div className={`relative flex items-start p-4 rounded-lg border ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
          <RadioGroupItem value="credit_card" id="credit_card" className="mt-1" />
          <Label htmlFor="credit_card" className="flex-1 ml-3 cursor-pointer">
            <div className="flex items-center mb-1">
              <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium">Cartão de Crédito</span>
            </div>
            <p className="text-sm text-gray-500">Parcelamento em até 12x. Aprovação imediata.</p>
          </Label>
        </div>
        
        <div className={`relative flex items-start p-4 rounded-lg border ${paymentMethod === 'boleto' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
          <RadioGroupItem value="boleto" id="boleto" className="mt-1" />
          <Label htmlFor="boleto" className="flex-1 ml-3 cursor-pointer">
            <div className="flex items-center mb-1">
              <FileText className="h-5 w-5 text-orange-600 mr-2" />
              <span className="font-medium">Boleto Bancário</span>
            </div>
            <p className="text-sm text-gray-500">Compensação em até 3 dias úteis após pagamento.</p>
          </Label>
        </div>
      </RadioGroup>
      
      <Button 
        className="w-full mt-6 bg-primary hover:bg-primary/90"
        onClick={handleProcessPayment}
        disabled={checkoutLoading || !paymentMethod}
        size="lg"
      >
        {checkoutLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando Pagamento...
          </>
        ) : (
          <>
            Finalizar Compra
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentSection;
