
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PixPayment from "./PixPayment";

interface PaymentTabsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  processPayment: () => void;
  isProcessing: boolean;
  pixCode: string;
  pixQrCodeImage: string;
  orderId?: string;
}

const PaymentTabs = ({
  paymentMethod,
  setPaymentMethod,
  processPayment,
  isProcessing,
  pixCode,
  pixQrCodeImage,
  orderId
}: PaymentTabsProps) => {
  return (
    <>
      <Tabs defaultValue="pix" className="w-full" onValueChange={setPaymentMethod}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pix" className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            <span>PIX</span>
          </TabsTrigger>
          <TabsTrigger value="credit_card" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Cartão</span>
          </TabsTrigger>
          <TabsTrigger value="standard" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>Checkout MP</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pix">
          <PixPayment 
            pixCode={pixCode} 
            pixQrCodeImage={pixQrCodeImage}
            orderId={orderId}
          />
        </TabsContent>
        
        <TabsContent value="credit_card">
          <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
            <p className="text-yellow-800">
              Pagamento com cartão de crédito será implementado em breve. Por favor, utilize outra forma de pagamento.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="standard">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Você será redirecionado para a página de pagamento do MercadoPago, onde poderá escolher entre diversas formas de pagamento.
            </p>
            
            <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Após finalizar o pagamento no MercadoPago, você retornará automaticamente para nossa loja.
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          className="w-full h-12"
          onClick={processPayment}
          disabled={isProcessing || !!pixCode}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : pixCode ? (
            <>Pagamento PIX gerado</>
          ) : (
            <>Finalizar compra</>
          )}
        </Button>
      </div>
    </>
  );
};

export default PaymentTabs;
