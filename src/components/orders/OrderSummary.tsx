
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingFee?: number;
  total: number;
}

const OrderSummary = ({ items, subtotal, shippingFee = 0, total }: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="font-medium mb-4">Itens do pedido</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantidade: {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Frete</span>
          <span>{formatCurrency(shippingFee)}</span>
        </div>
        <div className="flex justify-between font-medium text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
