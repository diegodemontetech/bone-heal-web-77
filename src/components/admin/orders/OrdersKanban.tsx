
import { DragDropContext } from "@hello-pangea/dnd";
import { Calendar, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import OrderKanbanColumn from "./components/OrderKanbanColumn";
import OrderCard from "./components/OrderCard";
import { useOrderActions } from "./components/useOrderActions";

const COLUMNS = [
  { id: 'novo', title: 'Novo', icon: Calendar },
  { id: 'sincronizando', title: 'Sincronizando', icon: Package },
  { id: 'sincronizado', title: 'Sincronizado', icon: CheckCircle2 },
  { id: 'cancelado', title: 'Cancelado', icon: AlertCircle }
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

    if (newStatus === 'sincronizando') {
      await syncOrderWithOmie(draggableId);
    } else {
      await handleUpdateOrderStatus(draggableId, newStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(column => (
          <OrderKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            count={getOrdersByStatus(column.id).length}
          >
            {getOrdersByStatus(column.id).map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                onClick={onViewOrder}
              />
            ))}
          </OrderKanbanColumn>
        ))}
      </div>
    </DragDropContext>
  );
};

export default OrdersKanban;
