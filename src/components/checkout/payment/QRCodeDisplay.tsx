
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Check, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixCode: string;
  isLoading?: boolean;
  qrCodeBase64?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  pixCode, 
  isLoading = false,
  qrCodeBase64
}) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrError, setQrError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0); // For forcing re-render on retry
  
  // Ensure PIX code is valid and clean
  const cleanPixCode = pixCode?.trim() || '';
  const isValidPixCode = cleanPixCode.length > 10; // Basic validation - PIX codes are typically long
  
  // Generate QR code using Google's API with error handling
  useEffect(() => {
    if (!isValidPixCode) {
      setQrError(true);
      console.error("Invalid or empty PIX code provided", { pixCodeLength: cleanPixCode.length });
      return;
    }
    
    try {
      // Use provided QR code base64 if available
      if (qrCodeBase64 && qrCodeBase64.startsWith('http')) {
        setQrCodeUrl(qrCodeBase64);
        setQrError(false);
        return;
      }
      
      // Generate QR code using Google's Chart API with cache-busting
      const encodedContent = encodeURIComponent(cleanPixCode);
      const googleChartUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedContent}&chs=300x300&chld=L|0&t=${new Date().getTime()}-${refreshKey}`;
      setQrCodeUrl(googleChartUrl);
      setQrError(false);
      
      console.log("QR Code generated with Google Charts API:", { 
        urlGenerated: true,
        pixCodeFirstChars: cleanPixCode.substring(0, 20) + "..." 
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      setQrError(true);
    }
  }, [cleanPixCode, qrCodeBase64, refreshKey]);

  const copyToClipboard = () => {
    if (!isValidPixCode) {
      toast.error("Código PIX inválido ou vazio.");
      return;
    }
    
    navigator.clipboard.writeText(cleanPixCode)
      .then(() => {
        setCopied(true);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error("Error copying to clipboard:", err);
        toast.error("Erro ao copiar o código PIX");
      });
  };

  const handleRetryQRCode = () => {
    setRefreshKey(prev => prev + 1); // Force a refresh of the QR code
    setQrError(false);
    toast.info("Gerando novo QR code...");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Gerando código PIX...</p>
      </div>
    );
  }

  if (!isValidPixCode) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-500 font-medium">Erro ao gerar código PIX.</p>
        <p className="text-sm text-gray-600 mt-2">
          O código PIX recebido é inválido ou está vazio. Por favor, tente novamente ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col items-center space-y-4 p-4">
          <h3 className="text-lg font-semibold">Pagamento PIX</h3>
          
          {qrCodeUrl && !qrError ? (
            <div className="border border-gray-200 p-4 rounded-md bg-white">
              <img 
                src={qrCodeUrl} 
                alt="QR Code PIX" 
                className="h-64 w-64 object-contain mx-auto"
                onError={(e) => {
                  console.error("Error loading QR code image");
                  setQrError(true);
                }}
              />
            </div>
          ) : (
            <div className="border border-gray-200 p-4 rounded-md bg-white flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
              <p className="text-sm text-gray-600 mb-3">Erro ao carregar QR code. Use o código abaixo.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryQRCode}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          )}
          
          <div className="w-full space-y-2">
            <Label htmlFor="pix-code">Código PIX Copia e Cola</Label>
            <div className="flex space-x-2">
              <Input 
                id="pix-code" 
                value={cleanPixCode} 
                readOnly 
                className="font-mono text-xs bg-gray-50"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                className={copied ? "border-green-500 text-green-500" : ""}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center w-full space-y-1">
            <p>1. Abra o app do seu banco</p>
            <p>2. Escolha pagar com PIX</p>
            <p>3. Escaneie o QR code ou copie e cole o código</p>
            <p>4. Confirme as informações e finalize o pagamento</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
