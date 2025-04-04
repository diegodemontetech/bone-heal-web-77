
import React from 'react';
import { Card } from "@/components/ui/card";
import QRCodeDisplay from "@/components/checkout/payment/QRCodeDisplay";

interface PixPaymentProps {
  pixCode: string;
  pixQrCodeImage?: string;
  orderId: string;
}

const PixPayment = ({ pixCode, pixQrCodeImage, orderId }: PixPaymentProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <QRCodeDisplay 
          pixCode={pixCode} 
          pixData={pixQrCodeImage} 
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
