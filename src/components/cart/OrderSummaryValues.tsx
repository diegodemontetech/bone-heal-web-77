
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/hooks/use-cart";

interface OrderSummaryValuesProps {
  cartItems: CartItem[];
  shippingCost: number | null;
}

const OrderSummaryValues = ({ cartItems, shippingCost }: OrderSummaryValuesProps) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Frete</span>
        <span className="font-medium">
          {shippingCost ? formatCurrency(shippingCost) : "Calculando..."}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default OrderSummaryValues;
