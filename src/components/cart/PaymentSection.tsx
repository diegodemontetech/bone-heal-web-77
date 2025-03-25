
import { CreditCard, QrCode, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  if (checkoutData && paymentMethod === 'pix' && checkoutData.point_of_interaction?.transaction_data?.qr_code) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg inline-block mx-auto">
            <img 
              src={`data:image/png;base64,${checkoutData.point_of_interaction.transaction_data.qr_code_base64}`} 
              alt="QR Code PIX" 
              className="mx-auto w-48 h-48"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Pagamento via PIX</h3>
            <p className="text-sm text-gray-500 mb-4">
              Escaneie o QR code acima com o aplicativo do seu banco ou copie o código abaixo
            </p>
            <div className="relative">
              <textarea 
                readOnly 
                className="w-full h-20 p-3 text-xs bg-gray-50 border rounded-md"
                value={checkoutData.point_of_interaction.transaction_data.qr_code}
              />
              <Button
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => {
                  navigator.clipboard.writeText(checkoutData.point_of_interaction.transaction_data.qr_code);
                  // You could add a toast here
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
