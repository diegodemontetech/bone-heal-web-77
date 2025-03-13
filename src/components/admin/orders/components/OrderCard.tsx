
import { Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { User, Calendar, Tag, Phone, Mail, MapPin } from "lucide-react";

interface OrderCardProps {
  order: any;
  index: number;
  onClick: (order: any) => void;
  columnColor?: string;
}

const OrderCard = ({ order, index, onClick, columnColor = "bg-gray-100" }: OrderCardProps) => {
  const formattedDate = format(new Date(order.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR });
  
  // Extrair as cores do columnColor para deixar o card com um tom mais claro
  const baseColor = columnColor.split(' ')[0];
  const cardBaseColor = baseColor.replace('bg-', '');
  
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
          className={`p-4 mb-3 rounded-lg border bg-white hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 duration-200 overflow-hidden`}
          onClick={() => onClick(order)}
        >
          {/* Cabeçalho do card com número do pedido e valor */}
          <div className="flex justify-between items-start mb-3">
            <div className={`px-2 py-1 rounded-md bg-${cardBaseColor}-50 border border-${cardBaseColor}-200`}>
              <span className="text-xs font-semibold text-gray-700">Pedido</span>
              <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
            </div>
            <div className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Valor</span>
              <p className="font-bold text-emerald-600">{formatCurrency(order.total_amount)}</p>
            </div>
          </div>

          {/* Informações do cliente */}
          {order.profiles && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-gray-500" />
                <p className="text-sm font-medium text-gray-800 truncate">
                  {order.profiles.full_name || "Cliente sem nome"}
                </p>
              </div>
              
              {order.profiles.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  <p className="text-xs text-gray-600">
                    {order.profiles.phone}
                  </p>
                </div>
              )}
              
              {order.profiles.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gray-500" />
                  <p className="text-xs text-gray-600 truncate max-w-[200px]">
                    {order.profiles.email}
                  </p>
                </div>
              )}
              
              {order.profiles.city && order.profiles.state && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <p className="text-xs text-gray-600">
                    {order.profiles.city}/{order.profiles.state}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Rodapé com data e número de itens */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <p className="text-xs text-gray-500">
                {formattedDate}
              </p>
            </div>
            {order.items && order.items.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default OrderCard;
