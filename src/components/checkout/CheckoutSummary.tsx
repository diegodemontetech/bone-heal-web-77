
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  shippingInfo: {
    zipCode?: string;
    cost?: number;
  } | null;
  cartTotal: number;
}

const CheckoutSummary = ({ cartItems, shippingInfo, cartTotal }: CheckoutSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Frete</span>
            <span>
              {shippingInfo?.cost 
                ? `R$ ${shippingInfo.cost.toFixed(2)}` 
                : "Calculando..."}
            </span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>
              R$ {(cartTotal + (shippingInfo?.cost || 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
