
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStatusSection from "./OrderStatusSection";
import OrderShippingSection from "./OrderShippingSection";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderItemsList from "./OrderItemsList";

interface OrderDetailsContentProps {
  order: any;
}

const OrderDetailsContent = ({ order }: OrderDetailsContentProps) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <OrderStatusSection 
              status={order.status} 
              id={order.id} 
              createdAt={order.created_at} 
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OrderShippingSection 
              shippingAddress={order.shipping_address} 
              shippingFee={order.shipping_fee} 
            />
            
            <OrderPaymentSection 
              payment_method={order.payment_method} 
              payments={order.payments} 
            />
          </div>
        </CardContent>
      </Card>
      
      <OrderItemsList items={order.items} />
    </div>
  );
};

export default OrderDetailsContent;
