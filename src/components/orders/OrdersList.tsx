
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  status: string;
  created_at: string;
  payment_method: string;
  total_amount: number;
  items: any[];
}

interface OrdersListProps {
  orders: Order[];
  navigate: (path: string) => void;
}

const OrdersList = ({ orders, navigate }: OrdersListProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Em processamento</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Pedido #{order.id.substring(0, 8)}</CardTitle>
                <p className="text-sm text-gray-600">
                  {formatDate(order.created_at)}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {order.items?.length || 0} item(s) • R$ {parseFloat(order.total_amount.toString()).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Pagamento: {order.payment_method === 'pix' ? 'PIX' : 
                              order.payment_method === 'credit' ? 'Cartão de Crédito' : 
                              order.payment_method === 'boleto' ? 'Boleto' : order.payment_method}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersList;
