
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
      codePreview: pixCode?.substring(0, 20) || 'none',
      imageType: typeof pixQrCodeImage
    });
    
    // Verificar se temos código PIX
    if (!pixCode) {
      console.error("Código PIX não fornecido");
      toast.error("Erro ao gerar código PIX. Por favor, tente novamente.");
      setIsLoading(false);
      return;
    }

    // Iniciar com a imagem QR code fornecida (se houver)
    let qrCode = pixQrCodeImage;
    
    // Garantir que a imagem QR code tenha formato adequado (data URL)
    if (pixQrCodeImage && typeof pixQrCodeImage === 'string') {
      if (!pixQrCodeImage.startsWith('data:') && !pixQrCodeImage.startsWith('http')) {
        console.log("Formatando imagem do QR code para incluir prefixo data URL");
        qrCode = `data:image/png;base64,${pixQrCodeImage}`;
      } else {
        console.log("Utilizando imagem QR code já formatada");
      }
    }
    
    // Se o QR code é uma URL real (não base64), use diretamente
    if (pixQrCodeImage && typeof pixQrCodeImage === 'string' && 
        (pixQrCodeImage.startsWith('http://') || pixQrCodeImage.startsWith('https://'))) {
      console.log("Usando QR code baseado em URL diretamente");
      qrCode = pixQrCodeImage;
    }
    
    // Se ainda não temos uma imagem de QR code válida, gerar uma usando Google Charts API
    if (!qrCode && pixCode) {
      console.log("Gerando QR code usando Google Charts API");
      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime();
      qrCode = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=H|0&t=${timestamp}`;
    }
    
    // Definir o QR code formatado e finalizar carregamento
    console.log("QR code finalizado:", qrCode?.substring(0, 30) + "...");
    setFormattedQrCode(qrCode);
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
