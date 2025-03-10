
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Copy } from "lucide-react";
import { toast } from "sonner";

interface PixOptionProps {
  isSelected: boolean;
  total: number;
  pixCode: string;
  pixQrCodeBase64: string;
}

const PixOption = ({ isSelected, total, pixCode, pixQrCodeBase64 }: PixOptionProps) => {
  const pixDiscount = total * 0.05; // 5% de desconto no PIX
  
  const copyPixCode = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível. Gere o QR Code primeiro.");
      return;
    }
    
    navigator.clipboard.writeText(pixCode)
      .then(() => toast.success("Código PIX copiado!"))
      .catch(() => toast.error("Erro ao copiar código PIX"));
  };

  return (
    <div className="flex items-center gap-2">
      <QrCode className="h-4 w-4 text-primary" />
      <span>PIX</span>
      <span className="text-green-600 text-sm font-medium ml-auto">
        5% de desconto
      </span>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-3 bg-green-50 rounded border border-green-100">
            <div className="flex justify-between mb-2">
              <span>Total com desconto:</span>
              <span className="text-green-600 font-medium">
                R$ {(total - pixDiscount).toFixed(2)}
              </span>
            </div>
            
            {pixCode ? (
              <div className="flex flex-col items-center mt-3">
                <div className="mb-3 p-2 bg-white rounded">
                  {pixQrCodeBase64 ? (
                    <img 
                      src={`data:image/png;base64,${pixQrCodeBase64}`} 
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {pixCode && (
                  <div className="flex items-center gap-2 w-full">
                    <Input 
                      value={pixCode} 
                      readOnly 
                      className="text-xs font-mono"
                    />
                    <Button size="sm" variant="outline" onClick={copyPixCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-center text-gray-600 mt-2">
                  Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para pagar
                </p>
                <p className="text-xs text-center font-medium text-red-500 mt-1">
                  Este código expira em 5 minutos
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 py-3">
                <p className="text-sm text-center">
                  Clique em "Gerar PIX" abaixo para gerar o QR Code PIX
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                  onClick={() => {
                    toast.info("Gerando QR Code PIX...");
                    // A geração real acontecerá no hook useCheckout quando o método de pagamento mudar
                  }}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Gerar PIX
                </Button>
                <div className="animate-pulse w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-gray-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PixOption;
