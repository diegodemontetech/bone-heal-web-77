
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import QRCodeDisplay from "@/components/checkout/payment/QRCodeDisplay";
import { toast } from "sonner";

interface PixPaymentProps {
  pixCode: string;
  orderId: string;
  mercadoPagoUrl?: string;
}

const PixPayment = ({ pixCode, orderId, mercadoPagoUrl }: PixPaymentProps) => {
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
      codeLength: pixCode?.length || 0,
      hasMercadoPagoUrl: Boolean(mercadoPagoUrl)
    });
    
    // Provide a clean PIX code to the QR code display
    setProcessedPixCode(pixCode);
    setIsLoading(false);
    
    // Show a toast with the Mercado Pago option if available
    if (mercadoPagoUrl) {
      toast.info("Você também pode pagar diretamente no Mercado Pago", {
        action: {
          label: "Acessar",
          onClick: () => window.open(mercadoPagoUrl, '_blank')
        }
      });
    }
  }, [pixCode, orderId, mercadoPagoUrl]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <QRCodeDisplay 
          pixCode={processedPixCode} 
          isLoading={isLoading}
          mercadoPagoUrl={mercadoPagoUrl}
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
