
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Copy, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface OpcaoPixProps {
  isSelected: boolean;
  total: number;
  pixCode: string;
  pixQrCodeBase64: string;
}

const OpcaoPix = ({ isSelected, total, pixCode, pixQrCodeBase64 }: OpcaoPixProps) => {
  const [copied, setCopied] = useState(false);
  const pixDiscount = total * 0.05; // 5% de desconto no PIX
  const finalValue = total - pixDiscount;
  
  const copyPixCode = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível. Gere o QR Code primeiro.");
      return;
    }
    
    navigator.clipboard.writeText(pixCode)
      .then(() => {
        setCopied(true);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => toast.error("Erro ao copiar código PIX"));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-green-100 p-1.5">
          <QrCode className="h-4 w-4 text-green-600" />
        </div>
        <span className="font-medium">PIX</span>
        <span className="text-green-600 text-sm font-medium ml-auto px-2 py-0.5 bg-green-50 rounded-full">
          5% de desconto
        </span>
      </div>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-4 bg-gradient-to-b from-white to-green-50 rounded-lg border border-green-100 shadow-sm">
            <div className="flex justify-between mb-3 pb-2 border-b border-dashed border-green-200">
              <span className="text-gray-600">Valor original:</span>
              <span className="font-medium">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 pb-2 border-b border-green-200">
              <span className="text-green-600 font-medium">Desconto PIX (5%):</span>
              <span className="text-green-600 font-medium">- R$ {pixDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-800 font-semibold">Valor final:</span>
              <span className="text-gray-800 font-bold text-lg">R$ {finalValue.toFixed(2)}</span>
            </div>
            
            {pixCode ? (
              <div className="flex flex-col items-center mt-3 space-y-4">
                <div className="mb-2 p-3 bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
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
                
                <div className="flex items-center w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <Input 
                    value={pixCode} 
                    readOnly 
                    className="text-xs font-mono border-0 bg-transparent"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyPixCode}
                    className={`px-3 h-full ${copied ? 'text-green-600' : ''}`}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="w-full space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={copyPixCode}
                  >
                    {copied ? 'Código copiado!' : 'Copiar código PIX'}
                  </Button>
                </div>
                
                <div className="flex items-center text-amber-600 text-xs gap-1 bg-amber-50 px-3 py-2 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Este código expira em 30 minutos</span>
                </div>
                
                <p className="text-xs text-center text-gray-600 mt-1">
                  Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para pagar
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 py-3">
                <p className="text-sm text-center text-gray-600">
                  Você receberá o QR Code PIX após finalizar o pedido
                </p>
                <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center">
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

export default OpcaoPix;
