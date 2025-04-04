
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
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

  // Generate QR code using Google Charts API - directly using the API for reliability
  const generateGoogleQRCode = () => {
    if (!pixCode) return null;
    
    // Add cache buster to prevent caching issues
    const timestamp = new Date().getTime();
    return `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=H|0&t=${timestamp}`;
  };

  const refreshQRCode = () => {
    setIsRefreshing(true);
    setQrImgError(false);
    
    // Always use Google Charts for generating QR code
    const googleQRCode = generateGoogleQRCode();
    if (googleQRCode) {
      setQrImgSrc(googleQRCode);
    }
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Update QR code when data changes
  useEffect(() => {
    console.log("QRCodeDisplay: Updating QR code display");
    setQrImgError(false);
    
    // Always try to generate QR code with Google Charts first - most reliable method
    const googleQRCode = generateGoogleQRCode();
    
    if (googleQRCode) {
      console.log("Using Google Charts QR code");
      setQrImgSrc(googleQRCode);
      return;
    }
    
    // If we couldn't generate QR code with Google Charts, try to use pixData
    if (pixData) {
      console.log("Using provided pixData");
      
      // Clean up pixData to ensure it's a valid URL or data URL
      if (pixData.startsWith('http') || pixData.startsWith('data:')) {
        setQrImgSrc(pixData);
      } else if (pixData.length > 100 && !pixData.includes(' ')) {
        // Likely a base64 string without data: prefix
        setQrImgSrc(`data:image/png;base64,${pixData}`);
      } else {
        // For other cases, try to use as is
        setQrImgSrc(pixData);
      }
    } else {
      console.log("No valid QR code data available");
      setQrImgSrc(null);
    }
  }, [pixData, pixCode]);

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
              console.error("Error loading QR code image, trying fallback method");
              setQrImgError(true);
              
              // Try to generate QR code with Google Charts API when image fails to load
              const googleQRCode = generateGoogleQRCode();
              if (googleQRCode) {
                // Use a setTimeout to avoid potential infinite rerender loop
                setTimeout(() => {
                  setQrImgSrc(googleQRCode);
                  setQrImgError(false);
                }, 100);
              }
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
