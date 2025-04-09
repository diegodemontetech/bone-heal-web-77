
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
  orderId,
  cartTotal
}: PaymentTabsProps) => {
  
  // Define o método de pagamento como "standard" (checkout do MercadoPago)
  useEffect(() => {
    setPaymentMethod("standard");
  }, [setPaymentMethod]);

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-blue-800 mb-2">Checkout rápido via Mercado Pago</h3>
        <p className="text-sm text-blue-700">
          Você será redirecionado para o ambiente seguro do Mercado Pago para concluir seu pagamento com cartão, PIX ou outros métodos.
        </p>
      </div>
      
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
