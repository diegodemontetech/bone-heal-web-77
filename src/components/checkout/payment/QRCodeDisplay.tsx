
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Check, AlertCircle, RefreshCw, QrCode } from "lucide-react";
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
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Clean the PIX code - removing any potential whitespace or invalid characters
  const cleanPixCode = (pixCode || '').trim().replace(/\s+/g, '');
  
  // Basic validation - PIX codes are typically long
  const isValidPixCode = cleanPixCode.length > 10;

  // Generate QR code with an explicit timestamp for cache-busting
  const generateQRCode = useCallback(() => {
    if (!isValidPixCode) {
      setQrError(true);
      console.error("Código PIX inválido ou vazio", { 
        pixCodeLength: cleanPixCode.length,
        pixCodeFirstChars: cleanPixCode.substring(0, 10) + "..."
      });
      return;
    }
    
    try {
      // If a base64 or URL is directly provided, use it
      if (qrCodeBase64) {
        if (qrCodeBase64.startsWith('data:') || qrCodeBase64.startsWith('http')) {
          setQrCodeUrl(qrCodeBase64);
          setQrError(false);
          return;
        }
        
        // Handle case where it's a raw base64 string without the data URI prefix
        if (!qrCodeBase64.includes('data:') && !qrCodeBase64.startsWith('http')) {
          setQrCodeUrl(`data:image/png;base64,${qrCodeBase64}`);
          setQrError(false);
          return;
        }
      }
      
      // Add specific cache-busting parameters to prevent cached QR codes
      const timestamp = new Date().getTime();
      const nonce = Math.floor(Math.random() * 1000000);
      
      // Use Google Charts API for reliable QR code generation
      const encodedContent = encodeURIComponent(cleanPixCode);
      const googleChartUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedContent}&chs=300x300&chld=L|0&t=${timestamp}-${nonce}-${refreshKey}`;
      
      setQrCodeUrl(googleChartUrl);
      setQrError(false);
      
      console.log("QR Code Mercado Pago gerado com sucesso", { 
        method: "Google Charts API",
        pixCodeLength: cleanPixCode.length,
        timestamp,
        refreshKey
      });
    } catch (error) {
      console.error("Erro ao gerar QR code:", error);
      setQrError(true);
    }
  }, [cleanPixCode, isValidPixCode, qrCodeBase64, refreshKey]);

  // Generate QR code on mount and when dependencies change
  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

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
        console.error("Erro ao copiar para clipboard:", err);
        toast.error("Erro ao copiar o código PIX");
      });
  };

  const handleRetryQRCode = () => {
    setRefreshKey(prev => prev + 1); // Force a refresh of the QR code
    setQrError(false);
    toast.info("Gerando novo QR code...");
    setTimeout(generateQRCode, 100); // Small delay to ensure state is updated
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
                alt="QR Code PIX Mercado Pago" 
                className="h-64 w-64 object-contain mx-auto"
                onError={(e) => {
                  console.error("Erro ao carregar imagem do QR code");
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
