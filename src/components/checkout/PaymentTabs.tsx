
import { useEffect } from "react";
import PaymentInfoAlert from "./PaymentInfoAlert";
import MercadoPagoCheckoutInfo from "./MercadoPagoCheckoutInfo";
import CheckoutButton from "./CheckoutButton";

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
  useEffect(() => {
    setPaymentMethod("standard");
  }, [setPaymentMethod]);

  return (
    <>
      <PaymentInfoAlert />
      
      <div className="space-y-6">
        <MercadoPagoCheckoutInfo />
      </div>
      
      <CheckoutButton 
        isProcessing={isProcessing} 
        onClick={processPayment} 
      />
    </>
  );
};

export default PaymentTabs;
