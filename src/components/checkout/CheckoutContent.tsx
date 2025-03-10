
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/hooks/use-cart";
import PaymentTabs from "@/components/checkout/PaymentTabs";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

interface CheckoutContentProps {
  cartItems: CartItem[];
  cartTotal: number;
  shippingInfo: {
    zipCode?: string;
    cost?: number;
  } | null;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  processPayment: () => void;
  isProcessing: boolean;
  pixCode: string;
  pixQrCodeImage: string;
  orderId?: string;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  cartItems,
  cartTotal,
  shippingInfo,
  paymentMethod,
  setPaymentMethod,
  processPayment,
  isProcessing,
  pixCode,
  pixQrCodeImage,
  orderId
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentTabs 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              processPayment={processPayment}
              isProcessing={isProcessing}
              pixCode={pixCode}
              pixQrCodeImage={pixQrCodeImage}
              orderId={orderId}
              cartTotal={cartTotal}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <CheckoutSummary 
          cartItems={cartItems}
          shippingInfo={shippingInfo}
          cartTotal={cartTotal}
        />
      </div>
    </div>
  );
};

export default CheckoutContent;
