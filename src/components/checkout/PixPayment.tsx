
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Copy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface PixPaymentProps {
  pixCode: string;
  pixQrCodeImage: string;
}

const PixPayment = ({ pixCode, pixQrCodeImage }: PixPaymentProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código PIX copiado!");
    
    // Reset copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  if (!pixCode) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          O pagamento via PIX é rápido, seguro e sem taxas. Após clicar em "Finalizar compra", 
          você receberá um QR code para escanear com seu aplicativo bancário.
        </p>
        
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="flex items-center space-x-2 text-blue-800">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>O pagamento é processado instantaneamente após a confirmação do PIX.</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 border-2 border-primary/20 rounded-xl bg-gradient-to-b from-white to-gray-50">
      <h3 className="font-medium text-lg mb-2 text-center text-primary">Pagamento PIX gerado!</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Escaneie o QR code abaixo ou copie o código PIX:
      </p>
      
      {pixQrCodeImage && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <img 
            src={`data:image/png;base64,${pixQrCodeImage}`}
            alt="QR Code PIX" 
            className="h-48 w-48 mx-auto"
          />
        </div>
      )}
      
      <div className="w-full mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-full p-3 bg-gray-100 rounded-md text-center overflow-hidden">
            <code className="text-xs break-all select-all">{pixCode}</code>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopyClick}
            className={`flex-shrink-0 ${copied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={handleCopyClick}
          className="w-full border-primary/30 hover:bg-primary/5"
        >
          {copied ? "Código copiado!" : "Copiar código PIX"}
        </Button>
      </div>
      
      <Alert className="bg-amber-50 border-amber-200 mt-2">
        <AlertDescription className="flex items-center gap-2 text-amber-800">
          <Clock className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <span>Este código PIX expira em <strong>30 minutos</strong>. Realize o pagamento dentro deste prazo.</span>
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-green-50 border-green-200 mt-3">
        <AlertDescription className="flex items-center gap-2 text-green-800">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
          <span>Após o pagamento, você receberá a confirmação e poderá acompanhar o pedido na área "Meus Pedidos".</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PixPayment;
