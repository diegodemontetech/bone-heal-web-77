
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect to process QR code data
  useEffect(() => {
    if (!pixCode) {
      console.error("PIX code not provided");
      toast.error("Erro ao gerar código PIX. Por favor, tente novamente.");
      setIsLoading(false);
      return;
    }
    
    console.log("PIX Payment - Processing PIX data:", { 
      hasCode: Boolean(pixCode), 
      codeLength: pixCode?.length || 0
    });
    
    // Set loading to false as we have the necessary data
    setIsLoading(false);
  }, [pixCode]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <QRCodeDisplay 
          pixCode={pixCode} 
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
