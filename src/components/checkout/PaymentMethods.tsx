
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, QrCode, Loader2 } from "lucide-react";

interface PaymentMethodsProps {
  paymentMethod: "credit" | "pix";
  setPaymentMethod: (method: "credit" | "pix") => void;
  loading: boolean;
  pixQrCode: string;
  pixCode: string;
}

const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
  loading,
  pixQrCode,
  pixCode,
}: PaymentMethodsProps) => {
  return (
    <Tabs defaultValue={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "credit" | "pix")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="credit">
          <CreditCard className="w-4 h-4 mr-2" />
          Cartão
        </TabsTrigger>
        <TabsTrigger value="pix">
          <QrCode className="w-4 h-4 mr-2" />
          PIX
        </TabsTrigger>
      </TabsList>
      <TabsContent value="credit">
        <p className="text-sm text-muted-foreground space-y-2">
          <span className="block">Você será redirecionado para a página segura do Mercado Pago para inserir os dados do seu cartão.</span>
          <span className="block text-green-600">✓ Ambiente seguro</span>
          <span className="block text-green-600">✓ Pagamento processado pelo Mercado Pago</span>
          <span className="block text-green-600">✓ Parcelamento em até 12x</span>
        </p>
      </TabsContent>
      <TabsContent value="pix" className="pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
          </div>
        ) : pixQrCode ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={`data:image/png;base64,${pixQrCode}`} 
                alt="QR Code PIX"
                className="max-w-[200px]"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Código PIX:</p>
              <p className="text-xs break-all select-all">{pixCode}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">
              O QR Code será gerado após clicar em "Finalizar Compra".
            </p>
            <p className="text-sm text-green-600">
              ✓ Pagamento instantâneo
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethods;
