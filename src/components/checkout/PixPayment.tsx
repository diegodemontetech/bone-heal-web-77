
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import QRCodeDisplay from "@/components/checkout/payment/QRCodeDisplay";
import { toast } from "sonner";

interface PixPaymentProps {
  pixCode: string;
  pixQrCodeImage?: string;
  orderId: string;
}

const PixPayment = ({ pixCode, pixQrCodeImage, orderId }: PixPaymentProps) => {
  const [formattedQrCode, setFormattedQrCode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Efeito para processar o QR code e a imagem
  useEffect(() => {
    setIsLoading(true);
    
    console.log("PixPayment - Processando dados PIX:", { 
      hasCode: Boolean(pixCode), 
      hasImage: Boolean(pixQrCodeImage),
      codeLength: pixCode?.length || 0
    });
    
    // Verificar se temos código PIX
    if (!pixCode) {
      console.error("Código PIX não fornecido");
      toast.error("Erro ao gerar código PIX. Por favor, tente novamente.");
      setIsLoading(false);
      return;
    }

    // Gerar QR code diretamente usando Google Charts API para maior confiabilidade
    const timestamp = new Date().getTime();
    const googleQrCode = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=H|0&t=${timestamp}`;
    console.log("QR code do Google gerado:", googleQrCode.substring(0, 100) + "...");
    
    // Definir o QR code formatado e finalizar carregamento
    setFormattedQrCode(googleQrCode);
    setIsLoading(false);
  }, [pixCode, pixQrCodeImage]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <QRCodeDisplay 
          pixCode={pixCode} 
          pixData={formattedQrCode} 
          isLoading={isLoading}
        />
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-center text-muted-foreground">
            ID do Pedido: <span className="font-mono text-xs">{orderId}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PixPayment;
