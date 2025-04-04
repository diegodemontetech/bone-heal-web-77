
import React from 'react';
import { Card } from "@/components/ui/card";
import QRCodeDisplay from "@/components/checkout/payment/QRCodeDisplay";

interface PixPaymentProps {
  pixCode: string;
  pixQrCodeImage?: string;
  orderId: string;
}

const PixPayment = ({ pixCode, pixQrCodeImage, orderId }: PixPaymentProps) => {
  // Check if the QR code image is valid and format it if needed
  let formattedQrCode = pixQrCodeImage;
  
  // Ensure the QR code image has a proper data URL format
  if (pixQrCodeImage && !pixQrCodeImage.startsWith('data:')) {
    console.log("Formatting QR code image to include data URL prefix");
    formattedQrCode = `data:image/png;base64,${pixQrCodeImage}`;
  }

  console.log(`PixPayment - Order ID: ${orderId}, Code exists: ${Boolean(pixCode)}, Image exists: ${Boolean(pixQrCodeImage)}`);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <QRCodeDisplay 
          pixCode={pixCode} 
          pixData={formattedQrCode} 
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
