
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Eye } from "lucide-react";

interface OrdersListProps {
  orders: any[];
  onViewOrder: (order: any) => void;
}

export const OrdersList = ({ orders, onViewOrder }: OrdersListProps) => {
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
        <Card key={order.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-medium">Pedido #{order.id.slice(0, 8)}</h3>
                <div className={`px-2 py-1 rounded text-sm ${getStatusColor(order.omie_status)}`}>
                  {order.omie_status.toUpperCase()}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {order.profiles?.full_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
              </p>
              <p className="font-medium text-primary mt-2">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(order.total_amount)}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onViewOrder(order)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
