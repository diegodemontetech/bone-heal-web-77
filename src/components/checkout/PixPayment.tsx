
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PixPaymentProps {
  pixCode: string;
  pixQrCodeImage: string;
}

const PixPayment = ({ pixCode, pixQrCodeImage }: PixPaymentProps) => {
  if (!pixCode) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          O pagamento via PIX é rápido, seguro e sem taxas. Após clicar em "Finalizar compra", 
          você receberá um QR code para escanear com seu aplicativo bancário.
        </p>
        
        <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          O pagamento é processado instantaneamente após a confirmação do PIX.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 border rounded-md">
      <h3 className="font-medium text-lg mb-4">Pagamento PIX gerado!</h3>
      <p className="text-sm text-gray-600 mb-4">
        Escaneie o QR code abaixo ou copie o código PIX:
      </p>
      
      {pixQrCodeImage && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <img 
            src={`data:image/png;base64,${pixQrCodeImage}`}
            alt="QR Code PIX" 
            className="h-48 w-48 mx-auto"
          />
        </div>
      )}
      
      <div className="w-full p-3 bg-gray-100 rounded-md mb-4 text-center overflow-hidden">
        <code className="text-xs break-all">{pixCode}</code>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => {
          navigator.clipboard.writeText(pixCode);
          toast.success("Código PIX copiado!");
        }}
      >
        Copiar código PIX
      </Button>
      
      <div className="mt-4 text-sm text-center text-green-600">
        Após o pagamento, você receberá a confirmação e poderá acompanhar o pedido na área "Meus Pedidos".
      </div>
    </div>
  );
};

export default PixPayment;
