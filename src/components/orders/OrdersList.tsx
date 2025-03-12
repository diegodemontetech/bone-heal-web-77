
import OrderCard from "./OrderCard";

interface Order {
  id: string;
  status: string;
  created_at: string;
  payment_method: string;
  total_amount: number;
  items: any[];
}

interface OrdersListProps {
  orders: Order[];
  navigate: (path: string) => void;
}

const OrdersList = ({ orders, navigate }: OrdersListProps) => {
  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} navigate={navigate} />
      ))}
    </div>
  );
};

export default OrdersList;
