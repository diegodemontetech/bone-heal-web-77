
import { DragDropContext } from "@hello-pangea/dnd";
import { Calendar, DollarSign, RefreshCw, FileCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import OrderKanbanColumn from "./components/OrderKanbanColumn";
import OrderCard from "./components/OrderCard";
import { useOrderActions } from "./components/useOrderActions";

const COLUMNS = [
  { id: 'novo', title: 'Novo', icon: Calendar, color: 'bg-amber-100 border-amber-200 text-amber-800' },
  { id: 'pago', title: 'Pago', icon: DollarSign, color: 'bg-blue-100 border-blue-200 text-blue-800' },
  { id: 'sincronizado', title: 'Sincronizado', icon: RefreshCw, color: 'bg-indigo-100 border-indigo-200 text-indigo-800' },
  { id: 'faturado', title: 'Faturado', icon: FileCheck, color: 'bg-emerald-100 border-emerald-200 text-emerald-800' },
  { id: 'entregue', title: 'Entregue', icon: Truck, color: 'bg-green-100 border-green-200 text-green-800' }
];

interface OrdersKanbanProps {
  orders: any[] | null;
  refetchOrders: () => void;
  onViewOrder: (order: any) => void;
}

const OrdersKanban = ({ orders, refetchOrders, onViewOrder }: OrdersKanbanProps) => {
  const { syncOrderWithOmie, handleUpdateOrderStatus } = useOrderActions(refetchOrders);

  const getOrdersByStatus = (status: string) => {
    return orders?.filter(order => order.omie_status === status) || [];
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    if (newStatus === 'sincronizado') {
      await syncOrderWithOmie(draggableId);
    } else {
      await handleUpdateOrderStatus(draggableId, newStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map(column => (
          <OrderKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            color={column.color}
            count={getOrdersByStatus(column.id).length}
          >
            {getOrdersByStatus(column.id).map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                onClick={onViewOrder}
                columnColor={column.color}
              />
            ))}
          </OrderKanbanColumn>
        ))}
      </div>
    </DragDropContext>
  );
};

export default OrdersKanban;
