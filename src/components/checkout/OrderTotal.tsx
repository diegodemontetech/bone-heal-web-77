
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderSummary from "@/components/orders/OrderSummary";
import { CartItem } from "@/hooks/use-cart";
import PaymentOptions from "./payment/PaymentOptions";
import DeliveryInfo from "./payment/DeliveryInfo";
import CheckoutButton from "./payment/CheckoutButton";

interface OrderTotalProps {
  cartItems: CartItem[];
  shippingFee: number;
  discount: number;
  loading: boolean;
  isLoggedIn: boolean;
  hasZipCode: boolean;
  onCheckout: () => void;
  deliveryDate: Date | null;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  checkoutData: any;
}

const OrderTotal = ({
  cartItems,
  shippingFee,
  discount,
  loading,
  isLoggedIn,
  hasZipCode,
  onCheckout,
  deliveryDate,
  paymentMethod,
  setPaymentMethod,
  checkoutData
}: OrderTotalProps) => {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee - discount;

  const getFinalAmount = (method: string) => {
    switch (method) {
      case 'pix':
        return total - (total * 0.05); // 5% de desconto no PIX
      default:
        return total;
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-primary">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <OrderSummary
          items={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          total={getFinalAmount(paymentMethod)}
        />

        <DeliveryInfo deliveryDate={deliveryDate} />

        <div className="mt-6 space-y-4">
          <PaymentOptions 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            total={total}
            checkoutData={checkoutData}
          />

          <CheckoutButton 
            isLoggedIn={isLoggedIn}
            hasZipCode={hasZipCode}
            loading={loading}
            amount={getFinalAmount(paymentMethod)}
            paymentMethod={paymentMethod}
            onCheckout={onCheckout}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTotal;
