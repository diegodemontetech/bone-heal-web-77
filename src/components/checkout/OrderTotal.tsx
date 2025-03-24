
import { Card, CardContent } from "@/components/ui/card";
import OrderSummary from "@/components/orders/OrderSummary";
import { CartItem } from "@/hooks/use-cart";
import PaymentOptions from "./payment/PaymentOptions";
import DeliveryInfo from "./payment/DeliveryInfo";
import CheckoutButton from "./payment/CheckoutButton";
import { ShoppingBag, Truck, BadgePercent, Receipt } from "lucide-react";

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
    <div className="space-y-6">
      <Card className="bg-white shadow-md border overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-white border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Resumo do Pedido
          </h2>
        </div>
        
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium pb-2 border-b">
              <ShoppingBag className="h-4 w-4" />
              <span>Itens do Carrinho</span>
            </div>
            
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              total={getFinalAmount(paymentMethod)}
            />

            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium pt-2 pb-2 border-b border-t">
              <Truck className="h-4 w-4" />
              <span>Entrega</span>
            </div>
            
            <DeliveryInfo deliveryDate={deliveryDate} />

            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium pt-2 pb-2 border-b">
              <BadgePercent className="h-4 w-4" />
              <span>Formas de Pagamento</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentOptions 
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        total={total}
        checkoutData={checkoutData}
      />

      <div className="mt-6">
        <CheckoutButton 
          isLoggedIn={isLoggedIn}
          hasZipCode={hasZipCode}
          loading={loading}
          amount={getFinalAmount(paymentMethod)}
          paymentMethod={paymentMethod}
          onCheckout={onCheckout}
        />
      </div>
    </div>
  );
};

export default OrderTotal;
