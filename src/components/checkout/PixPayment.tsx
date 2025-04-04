
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
  
  // Effect to handle QR code image processing
  useEffect(() => {
    setIsLoading(true);
    
    // Start with the provided QR code image
    let qrCode = pixQrCodeImage;
    
    console.log("Processing QR code for PIX payment", { 
      hasCode: Boolean(pixCode), 
      hasImage: Boolean(pixQrCodeImage),
      codePreview: pixCode?.substring(0, 20) || 'none',
      imageType: typeof pixQrCodeImage === 'string' ? 
        pixQrCodeImage.substring(0, 30) + '...' : 'none'
    });
    
    // Ensure the QR code image has a proper data URL format
    if (pixQrCodeImage && typeof pixQrCodeImage === 'string' && 
        !pixQrCodeImage.startsWith('data:') && 
        !pixQrCodeImage.startsWith('http')) {
      console.log("Formatting QR code image to include data URL prefix");
      qrCode = `data:image/png;base64,${pixQrCodeImage}`;
    }
    
    // If QR code is an actual URL (not base64), use it directly
    if (pixQrCodeImage && typeof pixQrCodeImage === 'string' && 
        (pixQrCodeImage.startsWith('http://') || pixQrCodeImage.startsWith('https://'))) {
      console.log("Using URL-based QR code directly");
      qrCode = pixQrCodeImage;
    }
    
    // If we still don't have a valid QR code image, generate one using Google Charts API
    if (!qrCode && pixCode) {
      console.log("Generating QR code using Google Charts API");
      qrCode = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=H|0`;
    }
    
    // Set the formatted QR code image
    setFormattedQrCode(qrCode);
    setIsLoading(false);
    
    if (!pixCode) {
      toast.error("Erro ao gerar código PIX. Por favor, tente novamente.");
    }
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
