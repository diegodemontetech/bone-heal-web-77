
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaymentTabsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  processPayment: () => void;
  isProcessing: boolean;
  pixCode: string;
  pixQrCodeImage: string;
  orderId?: string;
  cartTotal: number;
}

const PaymentTabs = ({
  paymentMethod,
  setPaymentMethod,
  processPayment,
  isProcessing,
  pixCode,
  pixQrCodeImage,
  orderId,
  cartTotal
}: PaymentTabsProps) => {
  
  // Define o método de pagamento como "standard" (checkout do MercadoPago)
  useState(() => {
    setPaymentMethod("standard");
  });

  return (
    <>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Informação de Pagamento</AlertTitle>
        <AlertDescription>
          O pagamento será processado através do MercadoPago. Você será redirecionado para a página
          de pagamento após clicar em "Finalizar compra".
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Checkout MercadoPago</h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Você será redirecionado para a página de pagamento do MercadoPago, onde poderá escolher entre diversas formas de pagamento como:
          </p>
          
          <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
            <li>Cartão de crédito</li>
            <li>PIX</li>
            <li>Boleto bancário</li>
          </ul>
          
          <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Após finalizar o pagamento no MercadoPago, você retornará automaticamente para nossa loja.
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          className="w-full h-12"
          onClick={processPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Finalizar compra
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default PaymentTabs;
