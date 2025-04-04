
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixData?: string;  // base64 encoded QR code image or URL (optional)
  pixCode: string;   // PIX code/copia e cola
  isLoading?: boolean;
}

const QRCodeDisplay = ({ pixData, pixCode, isLoading = false }: QRCodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [qrImgSrc, setQrImgSrc] = useState<string | null>(null);
  const [qrImgError, setQrImgError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle the copy to clipboard functionality
  const copyToClipboard = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível");
      return;
    }
    
    navigator.clipboard.writeText(pixCode)
      .then(() => {
        setCopied(true);
        toast.success("Código PIX copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((error) => {
        console.error("Erro ao copiar código PIX:", error);
        toast.error("Não foi possível copiar o código PIX");
      });
  };

  // Generate QR code using Google Charts API
  const generateQRCode = (text: string) => {
    if (!text) return null;
    
    try {
      // Add cache buster to prevent caching issues
      const timestamp = new Date().getTime();
      const encodedText = encodeURIComponent(text);
      return `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=300x300&chld=H|0&t=${timestamp}`;
    } catch (error) {
      console.error("Error generating QR code URL:", error);
      return null;
    }
  };

  const refreshQRCode = () => {
    setIsRefreshing(true);
    setQrImgError(false);
    
    setTimeout(() => {
      // Generate a new QR code
      if (pixCode) {
        const newQrCode = generateQRCode(pixCode);
        setQrImgSrc(newQrCode);
      }
      setIsRefreshing(false);
    }, 500);
  };

  // Update QR code when data changes
  useEffect(() => {
    if (!pixCode) {
      console.log("No PIX code provided for QR generation");
      setQrImgSrc(null);
      return;
    }
    
    console.log("Generating QR code for PIX code", pixCode.substring(0, 20) + "...");
    setQrImgError(false);
    
    // Generate QR code using Google Charts
    const newQrCode = generateQRCode(pixCode);
    setQrImgSrc(newQrCode);
  }, [pixCode]);

  // Show loading state while image is being processed
  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center mb-2">
          <h3 className="font-medium text-lg mb-1">Pagamento PIX</h3>
          <p className="text-sm text-muted-foreground">
            Gerando QR code...
          </p>
        </div>
        
        <div className="flex justify-center items-center h-48 w-48 bg-gray-100 rounded-lg">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // When pixCode is missing/empty, show error state
  if (!pixCode) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center mb-2">
          <h3 className="font-medium text-lg mb-1">Pagamento PIX</h3>
          <p className="text-sm text-red-500 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Erro ao gerar o código PIX
          </p>
        </div>
        
        <Card className="w-full bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <p className="text-center text-red-600 text-sm">
              Não foi possível gerar o código PIX. Por favor, tente novamente ou escolha outra forma de pagamento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-2">
        <h3 className="font-medium text-lg mb-1">Pagamento PIX</h3>
        <p className="text-sm text-muted-foreground">
          Escaneie o QR code abaixo ou copie o código PIX
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border flex justify-center items-center">
        {qrImgSrc && !qrImgError && !isRefreshing ? (
          <img 
            src={qrImgSrc} 
            alt="QR Code do PIX" 
            className="h-48 w-48"
            onError={(e) => {
              console.error("Error loading QR code image");
              setQrImgError(true);
              // Try regenerating with a slight delay
              setTimeout(refreshQRCode, 300);
            }}
          />
        ) : isRefreshing ? (
          <div className="h-48 w-48 bg-gray-100 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="h-48 w-48 bg-gray-100 flex flex-col items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
            <p className="text-xs text-center text-gray-500">
              Não foi possível carregar o QR code.<br />
              Use o código abaixo para pagar.
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={refreshQRCode}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Tentar novamente
            </Button>
          </div>
        )}
      </div>
      
      <Card className="w-full">
        <CardContent className="pt-4">
          <div className="flex flex-col space-y-2">
            <p className="text-xs text-gray-500 mb-1">Código PIX (copia e cola):</p>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-50 p-2 rounded text-xs flex-1 overflow-hidden border border-gray-200">
                <p className="break-all font-mono">{pixCode}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>O código PIX expira em 30 minutos.</p>
        <p>Após o pagamento, você receberá a confirmação por email.</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
