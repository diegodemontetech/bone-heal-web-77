
import { Draggable } from "@hello-pangea/dnd";
import { 
  CalendarClock, 
  User, 
  BadgeIndianRupee, 
  Truck, 
  Package, 
  FileText,
  MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatShortId } from "@/utils/formatters";

interface OrderCardProps {
  id: string;
  index: number;
  order: any;
  onOrderAction: (action: string, orderId: string) => void;
  onViewOrder?: () => void;
}

const OrderCard = ({ id, index, order, onOrderAction, onViewOrder }: OrderCardProps) => {
  const navigate = useNavigate();
  
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.id);
    toast.success("Número do pedido copiado!");
  };

  const handleCardClick = () => {
    if (onViewOrder) {
      onViewOrder();
    } else {
      navigate(`/admin/orders/${order.id}`);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md shadow-sm mb-3 overflow-hidden border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="p-3">
            {/* Header com número do pedido e data */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-500" />
                <span 
                  className="font-medium text-slate-800 cursor-pointer hover:text-primary" 
                  onClick={handleCardClick}
                >
                  #{formatShortId(order.id)}
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCardClick}>
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOrderAction('sync', order.id)}>
                    Sincronizar com Omie
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyOrderNumber}>
                    Copiar número
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Data de criação */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>{formatDate(order.created_at)}</span>
            </div>
            
            {/* Cliente */}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-2">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="truncate max-w-[200px]">
                {order.customer?.full_name || order.shipping?.recipient_name || order.profiles?.full_name || "Cliente não especificado"}
              </span>
            </div>
            
            {/* Valor total */}
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
              <BadgeIndianRupee className="h-3.5 w-3.5 text-slate-500" />
              <span>{formatCurrency(order.total_amount || 0)}</span>
            </div>
            
            {/* Etiquetas - Método de pagamento, Status, Entrega */}
            <div className="flex flex-wrap gap-2 mb-2">
              {order.payment_method && (
                <Badge variant="outline" className="text-xs font-normal bg-slate-50">
                  {order.payment_method === 'credit_card' ? 'Cartão' : 
                   order.payment_method === 'pix' ? 'PIX' : 
                   order.payment_method === 'boleto' ? 'Boleto' : order.payment_method}
                </Badge>
              )}
              
              {order.payment_status && (
                <Badge variant="outline" className={`text-xs font-normal ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status === 'approved' ? 'Pago' : 
                   order.payment_status === 'pending' ? 'Pendente' : 
                   order.payment_status === 'failed' ? 'Falhou' : order.payment_status}
                </Badge>
              )}
              
              {order.shipping_method && (
                <Badge variant="outline" className="text-xs font-normal bg-blue-50 text-blue-800 border-blue-200">
                  <Truck className="h-3 w-3 mr-1" />
                  {order.shipping_method}
                </Badge>
              )}
            </div>
            
            {/* Produtos */}
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{order.items?.length || 0} {order.items?.length === 1 ? 'produto' : 'produtos'}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default OrderCard;
