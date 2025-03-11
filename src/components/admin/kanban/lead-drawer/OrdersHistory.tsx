
import { formatCurrency } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrdersHistoryProps {
  orders: any[] | undefined;
}

export const OrdersHistory = ({ orders }: OrdersHistoryProps) => {
  if (!orders || orders.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <Label>Histórico de Pedidos</Label>
      <div className="border rounded-md divide-y">
        {orders.map((order: any) => (
          <div key={order.id} className="p-3">
            <div className="flex justify-between">
              <span className="font-medium">Pedido #{order.id.substring(0, 8)}</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
