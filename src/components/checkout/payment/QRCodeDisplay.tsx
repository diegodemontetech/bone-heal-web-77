
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixData?: string;  // base64 encoded QR code image or URL
  pixCode: string;   // PIX code/copia e cola
  isLoading?: boolean;
}

const QRCodeDisplay = ({ pixData, pixCode, isLoading = false }: QRCodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [qrImgSrc, setQrImgSrc] = useState<string | null>(null);
  const [qrImgError, setQrImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
  const generateGoogleQRCode = () => {
    if (!pixCode) return null;
    
    // Add cache buster to prevent caching issues
    const timestamp = new Date().getTime();
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=H|0&t=${timestamp}`;
    
    console.log("Generating QR code with Google Charts:", qrCodeUrl);
    return qrCodeUrl;
  };

  // Update QR code image when pixData changes or on retry
  useEffect(() => {
    console.log("QRCodeDisplay useEffect - pixData:", pixData?.substring(0, 30), "pixCode length:", pixCode?.length, "retryCount:", retryCount);
    setQrImgError(false);
    
    // Always try Google Charts first for reliability
    const googleQRCode = generateGoogleQRCode();
    
    if (googleQRCode) {
      console.log("Using Google Charts QR code");
      setQrImgSrc(googleQRCode);
    } else if (pixData) {
      // If Google Charts fails, try to use provided pixData
      console.log("Using provided pixData");
      
      // If pixData is already a complete URL or data URL, use it directly
      if (pixData.startsWith('http') || pixData.startsWith('data:')) {
        setQrImgSrc(pixData);
      } 
      // If it might be a base64 string without the data URL prefix
      else if (pixData.length > 100 && !pixData.includes(' ')) {
        setQrImgSrc(`data:image/png;base64,${pixData}`);
      }
      // For other cases, try to use as is
      else {
        setQrImgSrc(pixData);
      }
    } else {
      console.log("No pixData available");
      setQrImgSrc(null);
    }
  }, [pixData, pixCode, retryCount]);

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

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-2">
        <h3 className="font-medium text-lg mb-1">Pagamento PIX</h3>
        <p className="text-sm text-muted-foreground">
          Escaneie o QR code abaixo ou copie o código PIX
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border flex justify-center items-center">
        {qrImgSrc && !qrImgError ? (
          <img 
            src={qrImgSrc} 
            alt="QR Code do PIX" 
            className="h-48 w-48"
            onError={(e) => {
              console.error("Error loading QR code image, retrying with Google Charts API");
              setQrImgError(true);
              setRetryCount(prev => prev + 1);
              
              // Force a new QR code generation using Google Charts API
              const newQrCode = generateGoogleQRCode();
              if (newQrCode) {
                setQrImgSrc(newQrCode);
              }
            }}
          />
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
              onClick={() => {
                console.log("Retrying QR code generation");
                setQrImgError(false);
                setRetryCount(prev => prev + 1);
              }}
            >
              Tentar novamente
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
