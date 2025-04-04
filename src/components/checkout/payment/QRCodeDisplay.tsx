
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon, ClipboardCopy, QrCode } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixCode: string;
  isLoading?: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  pixCode, 
  isLoading = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [showCodeText, setShowCodeText] = useState(false);
  const [qrCodeImageSrc, setQrCodeImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when pixel code changes
    setCopied(false);
    setShowCodeText(false);
    
    if (pixCode) {
      // Check if the pixCode is a base64 image or URL
      if (pixCode.startsWith('data:image') || pixCode.startsWith('http')) {
        setQrCodeImageSrc(pixCode);
      } else {
        // Generate QR code from text if it's not an image URL
        const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodeURIComponent(pixCode)}`;
        setQrCodeImageSrc(qrCodeUrl);
      }
    }
  }, [pixCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      
      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Erro ao copiar código PIX:", error);
      toast.error("Não foi possível copiar. Tente novamente.");
    }
  };

  const toggleCodeText = () => {
    setShowCodeText(!showCodeText);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-center text-muted-foreground">Gerando código PIX...</p>
      </div>
    );
  }

  if (!pixCode) {
    return (
      <div className="p-6 text-center">
        <div className="rounded-lg bg-red-50 p-4 mb-4">
          <p className="text-red-700">Não foi possível gerar o código PIX.</p>
          <p className="text-sm text-red-600 mt-1">Tente novamente ou escolha outra forma de pagamento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-lg mb-1">Pague com PIX</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Escaneie o QR code abaixo ou copie o código PIX
        </p>
      </div>
      
      {qrCodeImageSrc && (
        <div className="border-2 border-primary/20 rounded-xl p-4 bg-primary/5 mb-4">
          <img 
            src={qrCodeImageSrc} 
            alt="QR Code PIX" 
            className="h-64 w-64 mx-auto" 
            onError={(e) => {
              console.error("Erro ao carregar QR code, tentando gerar novo");
              const fallbackSrc = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodeURIComponent(pixCode)}`;
              (e.target as HTMLImageElement).src = fallbackSrc;
            }}
          />
        </div>
      )}
      
      <div className="w-full space-y-3">
        <Button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2"
          variant="default"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4" />
              Código Copiado!
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4" />
              Copiar Código PIX
            </>
          )}
        </Button>
        
        <Button
          onClick={toggleCodeText}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <ClipboardCopy className="h-4 w-4" />
          {showCodeText ? "Ocultar Código" : "Mostrar Código"}
        </Button>
      </div>
      
      {showCodeText && (
        <div className="mt-4 w-full">
          <div className="p-3 bg-gray-50 border rounded-md text-xs font-mono overflow-x-auto">
            {pixCode.length > 100 
              ? `${pixCode.substring(0, 50)}...${pixCode.substring(pixCode.length - 50)}` 
              : pixCode}
          </div>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            O código completo será copiado ao clicar no botão acima
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 w-full">
        <p className="text-sm text-blue-700 text-center">
          Após o pagamento, o pedido será processado automaticamente.
          <br />
          Sua compra aparecerá em "Meus Pedidos".
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
