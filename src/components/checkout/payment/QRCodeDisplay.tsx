
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon, ClipboardCopy, QrCode, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixCode: string;
  isLoading?: boolean;
  mercadoPagoUrl?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  pixCode, 
  isLoading = false,
  mercadoPagoUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [showCodeText, setShowCodeText] = useState(false);
  const [qrCodeImageSrc, setQrCodeImageSrc] = useState<string | null>(null);
  const [qrCodeError, setQrCodeError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [extractedPixCode, setExtractedPixCode] = useState('');

  useEffect(() => {
    // Reset state when pix code changes
    setCopied(false);
    setShowCodeText(false);
    setQrCodeError(false);
    
    if (pixCode) {
      try {
        // Extract the actual PIX text code - this is crucial for the user to copy
        let pixTextCode = pixCode;
        
        // If pixCode is a Google Charts URL, try to extract the code parameter
        if (pixCode.includes('chart.googleapis.com')) {
          try {
            const url = new URL(pixCode);
            const chl = url.searchParams.get('chl');
            if (chl) {
              pixTextCode = decodeURIComponent(chl);
            }
          } catch (e) {
            console.error("Failed to extract PIX code from URL:", e);
          }
        }
        
        // Store the extracted code for copying
        setExtractedPixCode(pixTextCode);
        
        // Check if the pixCode is already a base64 image or URL for display
        if (pixCode.startsWith('data:image')) {
          console.log("Using provided Base64 QR code");
          setQrCodeImageSrc(pixCode);
        } else if (pixCode.startsWith('http')) {
          console.log("Using provided QR code URL");
          // Use the URL directly but add timestamp to prevent caching issues
          const timestamp = new Date().getTime();
          const qrUrl = pixCode.includes('?') 
            ? `${pixCode}&t=${timestamp}` 
            : `${pixCode}?t=${timestamp}`;
          setQrCodeImageSrc(qrUrl);
        } else {
          console.log("Converting PIX code to QR code:", pixCode.substring(0, 20) + "...");
          // Generate a fresh QR code with a timestamp to prevent caching
          const timestamp = new Date().getTime();
          const encodedData = encodeURIComponent(pixCode);
          setQrCodeImageSrc(`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encodedData}&t=${timestamp}`);
        }
      } catch (error) {
        console.error("Error setting up QR code:", error);
        setQrCodeError(true);
      }
    }
  }, [pixCode, retryCount]);

  const copyToClipboard = async () => {
    try {
      // Always use the extracted PIX code, which should be the raw text code
      const textToCopy = extractedPixCode || pixCode;
      
      await navigator.clipboard.writeText(textToCopy);
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
  
  const retryQrCode = () => {
    if (pixCode) {
      try {
        setQrCodeError(false);
        // Increment retry count to force useEffect to regenerate QR
        setRetryCount(prev => prev + 1);
        toast.info("Gerando QR code novamente...");
      } catch (error) {
        console.error("Error regenerating QR code:", error);
        setQrCodeError(true);
        toast.error("Não foi possível gerar o QR code. Tente copiar o código PIX.");
      }
    }
  };
  
  const openMercadoPago = () => {
    if (mercadoPagoUrl) {
      window.open(mercadoPagoUrl, '_blank');
      toast.info("Redirecionando para o Mercado Pago...");
    }
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
      
      <div className="border-2 border-primary/20 rounded-xl p-4 bg-white mb-4 shadow-sm">
        {qrCodeError ? (
          <div className="h-64 w-64 flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-lg">
            <QrCode className="h-16 w-16 text-red-300 mb-2" />
            <p className="text-sm text-red-600 mb-3">Erro ao gerar QR Code</p>
            <Button variant="outline" size="sm" onClick={retryQrCode} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        ) : qrCodeImageSrc ? (
          <div className="bg-white p-2 rounded-md shadow-sm">
            <img 
              src={qrCodeImageSrc} 
              alt="QR Code PIX" 
              className="h-64 w-64 mx-auto"
              style={{ backgroundColor: "white", padding: "4px" }}
              onError={() => {
                console.error("Erro ao carregar QR code");
                setQrCodeError(true);
              }}
              onLoad={() => {
                setQrCodeError(false);
              }}
            />
          </div>
        ) : (
          <div className="h-64 w-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <QrCode className="h-16 w-16 text-gray-400 animate-pulse" />
          </div>
        )}
      </div>
      
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
        
        {mercadoPagoUrl && (
          <Button
            onClick={openMercadoPago}
            className="w-full flex items-center justify-center gap-2"
            variant="secondary"
          >
            <ExternalLink className="h-4 w-4" />
            Pagar no Mercado Pago
          </Button>
        )}
        
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
          <div className="p-3 bg-gray-50 border rounded-md text-xs font-mono overflow-x-auto break-all">
            {extractedPixCode || pixCode}
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
