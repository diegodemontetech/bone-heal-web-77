
import { QrCode, Copy, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OpcaoPixProps {
  isSelected: boolean;
  total: number;
  pixCode: string;
  pixQrCodeBase64: string;
}

const OpcaoPix = ({ isSelected, total, pixCode, pixQrCodeBase64 }: OpcaoPixProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrCodeError, setQrCodeError] = useState(false);
  
  // Debug information
  console.log("OpcaoPix props:", { 
    hasPixCode: !!pixCode,
    pixCodeLength: pixCode?.length || 0,
    hasQrCode: !!pixQrCodeBase64,
    qrCodeType: typeof pixQrCodeBase64 === 'string' ? 
      `${pixQrCodeBase64.substring(0, 20)}...` : 'undefined'
  });
  
  useEffect(() => {
    if (pixQrCodeBase64) {
      try {
        // If it's already a data URL or an http URL
        if (pixQrCodeBase64.startsWith('data:') || pixQrCodeBase64.startsWith('http')) {
          setQrCodeUrl(pixQrCodeBase64);
        } 
        // If it's a base64 string without the data:image prefix
        else if (/^[A-Za-z0-9+/=]+$/.test(pixQrCodeBase64)) {
          setQrCodeUrl(`data:image/png;base64,${pixQrCodeBase64}`);
        }
        // Fallback to generating a QR code from the PIX code using Google Charts
        else if (pixCode) {
          generateQrCodeFromText(pixCode);
        }
        setQrCodeError(false);
      } catch (error) {
        console.error("Error processing QR code:", error);
        setQrCodeError(true);
        // Fallback to generating a QR code from the PIX code
        if (pixCode) {
          generateQrCodeFromText(pixCode);
        }
      }
    } else if (pixCode) {
      // No QR code image provided, but we have the PIX code, so generate QR code
      generateQrCodeFromText(pixCode);
    }
  }, [pixQrCodeBase64, pixCode]);
  
  const generateQrCodeFromText = (text: string) => {
    try {
      const encodedText = encodeURIComponent(text);
      const timestamp = new Date().getTime();
      setQrCodeUrl(`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodedText}&t=${timestamp}`);
      setQrCodeError(false);
    } catch (error) {
      console.error("Error generating QR code from text:", error);
      setQrCodeError(true);
    }
  };

  const copyToClipboard = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível");
      return;
    }
    
    navigator.clipboard.writeText(pixCode)
      .then(() => toast.success("Código PIX copiado!"))
      .catch(() => toast.error("Erro ao copiar código PIX"));
  };

  const refreshPixCode = async () => {
    try {
      setIsLoading(true);
      toast.info("Gerando novo código PIX...");
      
      // Simulate refresh - in a real implementation, this would call an API
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Código PIX atualizado");
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar código PIX:", error);
      toast.error("Erro ao gerar novo código PIX");
      setIsLoading(false);
    }
  };

  const retryQrCode = () => {
    if (pixCode) {
      setQrCodeError(false);
      generateQrCodeFromText(pixCode);
      toast.info("Tentando gerar QR code novamente...");
    } else {
      toast.error("Código PIX não disponível para gerar QR code");
    }
  };

  // Only show QR code content if we have a PIX code
  const showQrContent = !!pixCode;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-green-100 p-1.5">
          <QrCode className="h-4 w-4 text-green-600" />
        </div>
        <span className="font-medium">PIX</span>
        <span className="text-green-600 text-sm ml-auto px-2 py-0.5 bg-green-50 rounded-full">
          à vista
        </span>
      </div>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-4 bg-gradient-to-b from-white to-green-50 rounded-lg border border-green-100 shadow-sm">
            <div className="flex justify-between mb-3 pb-2 border-b border-dashed border-green-200">
              <span className="text-gray-700">Valor do PIX:</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>
            
            {showQrContent ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {qrCodeError ? (
                    <div className="w-48 h-48 mx-auto flex flex-col items-center justify-center bg-gray-100 border-2 border-amber-200 rounded-lg p-2">
                      <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
                      <p className="text-xs text-amber-700 text-center mb-2">Erro ao carregar QR Code</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={retryQrCode}
                        className="text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Tentar novamente
                      </Button>
                    </div>
                  ) : qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 mx-auto border-2 border-green-200 rounded-lg p-2"
                      onError={() => {
                        console.error("Error loading QR code image");
                        setQrCodeError(true);
                      }}
                    />
                  ) : (
                    <div className="w-48 h-48 mx-auto flex items-center justify-center bg-gray-100 border-2 border-green-200 rounded-lg p-2">
                      <QrCode className="w-16 h-16 text-gray-400 animate-pulse" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600">
                    Escaneie o QR Code acima com o aplicativo do seu banco
                  </p>
                  
                  <Button 
                    variant="outline" 
                    onClick={copyToClipboard}
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar código PIX
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={refreshPixCode}
                    disabled={isLoading}
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Gerando...' : 'Gerar novo código'}
                  </Button>
                  
                  <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full text-xs text-gray-500 hover:bg-gray-50"
                      >
                        {isOpen ? "Ocultar código PIX" : "Mostrar código PIX"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-xs text-gray-600 break-all font-mono">
                          {pixCode}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-800 text-center">
                    O pagamento será confirmado em até 30 segundos após realizado
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <QrCode className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-600">
                  O código PIX será gerado após a finalização do pedido
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpcaoPix;
