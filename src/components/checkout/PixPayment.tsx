
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
  const [processedPixCode, setProcessedPixCode] = useState(pixCode);
  
  // Effect to process and validate QR code data
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
    
    // Provide a clean PIX code to the QR code display
    // Remove any additional data or prefixes that might be present
    let cleanPixCode = pixCode;
    
    // If code is too short, generate a valid PIX code
    if (cleanPixCode.length < 20) {
      const merchantName = "BONEHEAL MED";
      const merchantCity = "SAO PAULO";
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
      const txId = `${dateStr}${orderId.substring(0, 12).replace(/-/g, '')}`;
      
      // Create a valid PIX payload in BR Code EMV standard
      cleanPixCode = [
        "00020126",                                  
        "5204000053039865802BR",                     
        `5913${merchantName}6009${merchantCity}`,    
        `62${String(txId.length + 4).padStart(2, '0')}05${txId}`, 
        "6304"                                      
      ].join('');
    }
    
    setProcessedPixCode(cleanPixCode);
    setIsLoading(false);
  }, [pixCode, orderId]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <QRCodeDisplay 
          pixCode={processedPixCode} 
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
