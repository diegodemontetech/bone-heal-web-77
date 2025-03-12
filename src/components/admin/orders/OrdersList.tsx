
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Eye, Package, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/order";

interface OrdersListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export const OrdersList = ({ orders, onViewOrder }: OrdersListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sincronizado': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'sincronizando': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelado': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Package className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sincronizado': return 'bg-green-100 text-green-800 border-green-200';
      case 'sincronizando': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${getStatusColor(order.omie_status)} bg-opacity-10`}>
                {getStatusIcon(order.omie_status)}
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.omie_status)}`}>
                    {order.omie_status.toUpperCase()}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-500 space-y-1">
                  <p>{order.profiles?.full_name}</p>
                  <p>{format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}</p>
                  <p className="font-medium text-primary">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewOrder(order)}
              className="hover:bg-gray-100"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
