
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Check, AlertCircle } from "lucide-react";
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
  
  // Generate QR code using Google's API
  useEffect(() => {
    if (pixCode) {
      try {
        // Use provided QR code base64 if available
        if (qrCodeBase64) {
          setQrCodeUrl(qrCodeBase64);
          setQrError(false);
          return;
        }
        
        // Clean up the PIX code first (remove any unwanted characters)
        const cleanCode = pixCode.trim();
        
        // Generate QR code using Google's Chart API
        const encodedContent = encodeURIComponent(cleanCode);
        const googleChartUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedContent}&chs=300x300&chld=L|0&t=${new Date().getTime()}`;
        setQrCodeUrl(googleChartUrl);
        setQrError(false);
        
        console.log("QR Code generated successfully:", { 
          pixCode: cleanCode.substring(0, 20) + "...", 
          urlGenerated: true 
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
        setQrError(true);
      }
    }
  }, [pixCode, qrCodeBase64]);

  const copyToClipboard = () => {
    if (!pixCode) return;
    
    navigator.clipboard.writeText(pixCode)
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Gerando código PIX...</p>
      </div>
    );
  }

  if (!pixCode) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Erro ao gerar código PIX. Por favor, tente novamente.</p>
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
                  console.error("Error loading QR code, trying again");
                  setQrError(true);
                  // Try to regenerate with a new timestamp to avoid caching
                  const newUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=L|0&t=${new Date().getTime()}`;
                  const target = e.target as HTMLImageElement;
                  target.src = newUrl;
                }}
              />
            </div>
          ) : (
            <div className="border border-gray-200 p-4 rounded-md bg-white flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
              <p className="text-sm text-gray-600">Erro ao carregar QR code. Use o código abaixo.</p>
            </div>
          )}
          
          <div className="w-full space-y-2">
            <Label htmlFor="pix-code">Código PIX Copia e Cola</Label>
            <div className="flex space-x-2">
              <Input 
                id="pix-code" 
                value={pixCode} 
                readOnly 
                className="font-mono text-xs bg-gray-50"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
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
