
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderSummary from "@/components/orders/OrderSummary";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";

interface OrderTotalProps {
  cartItems: CartItem[];
  shippingFee: number;
  discount: number;
  loading: boolean;
  isLoggedIn: boolean;
  hasZipCode: boolean;
  onCheckout: () => void;
}

const OrderTotal = ({
  cartItems,
  shippingFee,
  discount,
  loading,
  isLoggedIn,
  hasZipCode,
  onCheckout,
}: OrderTotalProps) => {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee - discount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderSummary
          items={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          total={total}
        />

        <Button
          className="w-full mt-6"
          size="lg"
          onClick={onCheckout}
          disabled={loading || !hasZipCode || !isLoggedIn}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Finalizar Compra"
          )}
        </Button>

        {!isLoggedIn && (
          <p className="text-sm text-red-500 text-center mt-2">
            Faça login para finalizar a compra
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTotal;
