
interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
}

const OrderSummary = ({ items, subtotal, shippingFee, discount = 0, total }: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>{item.quantity}x {item.name}</span>
          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Frete</span>
          <span>R$ {shippingFee.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Desconto</span>
            <span>- R$ {discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-medium text-lg pt-2 border-t">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
