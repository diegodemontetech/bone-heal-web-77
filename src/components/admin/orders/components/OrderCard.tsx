
import { Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface OrderCardProps {
  order: any;
  index: number;
  onClick: (order: any) => void;
}

const OrderCard = ({ order, index, onClick }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-yellow-100 border-yellow-200';
      case 'sincronizando': return 'bg-blue-100 border-blue-200';
      case 'sincronizado': return 'bg-green-100 border-green-200';
      case 'cancelado': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <Draggable
      key={order.id}
      draggableId={order.id}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-2 rounded border ${getStatusColor(order.omie_status)} hover:shadow-md transition-shadow cursor-pointer`}
          onClick={() => onClick(order)}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                Pedido #{order.id.slice(0, 8)}
              </p>
              {order.profiles && (
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-800">
                    {order.profiles.full_name}
                  </p>
                  {order.profiles.phone && (
                    <p className="text-xs text-gray-600">
                      {order.profiles.phone}
                    </p>
                  )}
                  {order.profiles.email && (
                    <p className="text-xs text-gray-600 truncate max-w-[200px]">
                      {order.profiles.email}
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm mt-2">
                {format(new Date(order.created_at), "dd/MM/yyyy")}
              </p>
            </div>
            <p className="font-medium text-primary">
              {formatCurrency(order.total_amount)}
            </p>
          </div>
          
          {order.items && order.items.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default OrderCard;
