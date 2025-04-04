
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  pixData?: string;
  pixCode: string;
}

const QRCodeDisplay = ({ pixData, pixCode }: QRCodeDisplayProps) => {
  const copyToClipboard = () => {
    if (!pixCode) {
      toast.error("Código PIX não disponível");
      return;
    }
    
    navigator.clipboard.writeText(pixCode);
    toast.success("Código PIX copiado para a área de transferência!");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-2">
        <h3 className="font-medium text-lg mb-1">Pagamento PIX</h3>
        <p className="text-sm text-muted-foreground">
          {pixData 
            ? "Escaneie o QR code abaixo ou copie o código PIX" 
            : "Copie o código PIX abaixo para pagamento"}
        </p>
      </div>
      
      {pixData && (
        <div className="bg-white p-4 rounded-lg border flex justify-center">
          <img 
            src={`data:image/png;base64,${pixData}`} 
            alt="QR Code do PIX" 
            className="h-48 w-48"
          />
        </div>
      )}
      
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
