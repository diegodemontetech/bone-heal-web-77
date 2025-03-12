
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusSectionProps {
  status: string;
  id: string;
  createdAt: string;
}

const OrderStatusSection = ({ status, id, createdAt }: OrderStatusSectionProps) => {
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex justify-between items-center">
      <span>Pedido #{id.substring(0, 8)}</span>
      {getStatusBadge(status)}
      <p className="text-sm text-gray-600">
        Realizado em {formatDate(createdAt)}
      </p>
      <div className="flex items-start gap-4">
        <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <h3 className="font-medium">Status</h3>
          <p className="text-sm text-gray-600">
            {status === 'pending' ? 'Aguardando pagamento' :
             status === 'processing' ? 'Em processamento' :
             status === 'completed' ? 'Concluído' :
             status === 'cancelled' ? 'Cancelado' : status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusSection;
