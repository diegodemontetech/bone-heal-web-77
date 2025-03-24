
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentTabs from "@/components/checkout/PaymentTabs";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  handleProcessPayment: () => void;
  checkoutLoading: boolean;
  checkoutData: any;
  orderId: string | null;
}

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  handleProcessPayment,
  checkoutLoading,
  checkoutData,
  orderId
}: PaymentSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentTabs 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          processPayment={handleProcessPayment}
          isProcessing={checkoutLoading}
          pixCode={checkoutData?.point_of_interaction?.transaction_data?.qr_code || ""}
          pixQrCodeImage={checkoutData?.point_of_interaction?.transaction_data?.qr_code_base64 || ""}
          orderId={orderId || ""}
          cartTotal={0} // This will be calculated in the PaymentTabs component
        />
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
