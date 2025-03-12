
import OrderCard from "./OrderCard";
import { Order } from "@/types/order";

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
