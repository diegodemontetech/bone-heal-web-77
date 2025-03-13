
import { DragDropContext } from "@hello-pangea/dnd";
import OrderKanbanColumn from "./components/OrderKanbanColumn";
import OrderCard from "./components/OrderCard";
import { 
  FilePlus, 
  CreditCard, 
  RefreshCw, 
  FileCheck, 
  PackageCheck 
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  [key: string]: any;
}

interface OrdersKanbanProps {
  orders: Order[];
  onStatusChange?: (orderId: string, newStatus: string) => Promise<void>;
  onOrderAction?: (action: string, orderId: string) => void;
  refetchOrders?: () => void;
  onViewOrder?: (order: Order) => void;
}

const OrdersKanban = ({ orders, onStatusChange, onOrderAction = () => {}, refetchOrders, onViewOrder }: OrdersKanbanProps) => {
  const [groupedOrders, setGroupedOrders] = useState<Record<string, Order[]>>({
    new: [],
    paid: [],
    synced: [],
    invoiced: [],
    delivered: [],
  });

  useEffect(() => {
    const grouped: Record<string, Order[]> = {
      new: [],
      paid: [],
      synced: [],
      invoiced: [],
      delivered: [],
    };

    orders.forEach(order => {
      const status = order.status || 'new';
      if (grouped[status]) {
        grouped[status].push(order);
      } else {
        grouped.new.push(order);
      }
    });

    setGroupedOrders(grouped);
  }, [orders]);

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // Descartado fora da área de drop ou no mesmo lugar
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Pedido movido para uma coluna/status diferente
    if (destination.droppableId !== source.droppableId) {
      try {
        // Atualizar a UI imediatamente para melhor experiência do usuário
        const sourceOrders = [...groupedOrders[source.droppableId]];
        const destinationOrders = [...groupedOrders[destination.droppableId]];
        const movedOrder = sourceOrders.find(order => order.id === draggableId);
        
        if (!movedOrder) return;
        
        // Remover da coluna de origem
        const newSourceOrders = sourceOrders.filter(order => order.id !== draggableId);
        
        // Adicionar à coluna de destino
        const newDestinationOrders = [...destinationOrders];
        newDestinationOrders.splice(destination.index, 0, { ...movedOrder, status: destination.droppableId });
        
        // Atualizar estado
        setGroupedOrders({
          ...groupedOrders,
          [source.droppableId]: newSourceOrders,
          [destination.droppableId]: newDestinationOrders
        });
        
        // Chamar callback de mudança de status
        if (onStatusChange) {
          await onStatusChange(draggableId, destination.droppableId);
        }
      } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        toast.error("Erro ao mover pedido. Tente novamente.");
        
        // Reverter para o estado anterior em caso de erro
        // Recarregando os pedidos originais
        const grouped: Record<string, Order[]> = {
          new: [],
          paid: [],
          synced: [],
          invoiced: [],
          delivered: [],
        };

        orders.forEach(order => {
          const status = order.status || 'new';
          if (grouped[status]) {
            grouped[status].push(order);
          } else {
            grouped.new.push(order);
          }
        });

        setGroupedOrders(grouped);
      }
    } else {
      // Reordenamento dentro da mesma coluna
      const columnOrders = [...groupedOrders[source.droppableId]];
      const [movedOrder] = columnOrders.splice(source.index, 1);
      columnOrders.splice(destination.index, 0, movedOrder);
      
      setGroupedOrders({
        ...groupedOrders,
        [source.droppableId]: columnOrders
      });
    }
  };

  const columns = [
    { 
      id: "new", 
      title: "Novo", 
      icon: FilePlus, 
      color: "bg-blue-100 text-blue-800" 
    },
    { 
      id: "paid", 
      title: "Pago", 
      icon: CreditCard, 
      color: "bg-emerald-100 text-emerald-800" 
    },
    { 
      id: "synced", 
      title: "Sincronizado", 
      icon: RefreshCw, 
      color: "bg-purple-100 text-purple-800" 
    },
    { 
      id: "invoiced", 
      title: "Faturado", 
      icon: FileCheck, 
      color: "bg-amber-100 text-amber-800" 
    },
    { 
      id: "delivered", 
      title: "Entregue", 
      icon: PackageCheck, 
      color: "bg-green-100 text-green-800" 
    }
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-10">
        {columns.map((column) => (
          <OrderKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            color={column.color}
            count={groupedOrders[column.id]?.length || 0}
          >
            {groupedOrders[column.id]?.map((order, index) => (
              <OrderCard
                key={order.id}
                id={order.id}
                index={index}
                order={order}
                onOrderAction={onOrderAction}
                onViewOrder={onViewOrder ? () => onViewOrder(order) : undefined}
              />
            ))}
          </OrderKanbanColumn>
        ))}
      </div>
    </DragDropContext>
  );
};

export default OrdersKanban;
