
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixData?: string;  // base64 encoded QR code image
  pixCode: string;   // PIX code/copia e cola
}

const QRCodeDisplay = ({ pixData, pixCode }: QRCodeDisplayProps) => {
  const copyToClipboard = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível");
      return;
    }
    
    navigator.clipboard.writeText(pixCode)
      .then(() => toast.success("Código PIX copiado para a área de transferência!"))
      .catch((error) => {
        console.error("Erro ao copiar código PIX:", error);
        toast.error("Não foi possível copiar o código PIX");
      });
  };

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

  // Check if the QR code image is valid
  const isValidQrCode = pixData && (
    pixData.startsWith('data:image/png;base64,') || 
    pixData.startsWith('data:image/jpeg;base64,') || 
    pixData.startsWith('data:image/jpg;base64,')
  );

  console.log("QR Code data received:", isValidQrCode ? "Valid QR code image" : "Invalid or missing QR code image", 
    pixData ? pixData.substring(0, 50) + "..." : "No QR code data");

  // Attempt to generate QR code dynamically if needed
  const qrCodeUrl = isValidQrCode ? pixData : 
    `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=L|0`;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-2">
        <h3 className="font-medium text-lg mb-1">Pagamento PIX</h3>
        <p className="text-sm text-muted-foreground">
          Escaneie o QR code abaixo ou copie o código PIX
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border flex justify-center items-center">
        {isValidQrCode ? (
          <img 
            src={pixData} 
            alt="QR Code do PIX" 
            className="h-48 w-48"
            onError={(e) => {
              console.error("Error loading provided QR code image, falling back to generated QR code");
              e.currentTarget.src = qrCodeUrl;
            }}
          />
        ) : (
          <img 
            src={qrCodeUrl}
            alt="QR Code do PIX" 
            className="h-48 w-48"
            onError={(e) => {
              console.error("Error loading generated QR code image");
              e.currentTarget.alt = "QR Code não disponível";
              e.currentTarget.style.display = "none";
              // Show fallback text
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('p');
                fallback.textContent = "QR Code não disponível. Use o código abaixo.";
                fallback.className = "text-sm text-gray-500 text-center";
                parent.appendChild(fallback);
              }
            }}
          />
        )}
      </div>
      
      <Card className="w-full">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2">
            <div className="bg-muted p-2 rounded text-xs flex-1 overflow-hidden">
              <p className="truncate">{pixCode}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
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
