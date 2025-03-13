
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketStatusBadge from "../TicketStatusBadge";
import TicketPriorityBadge from "../TicketPriorityBadge";
import TicketCategoryBadge from "../TicketCategoryBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TicketInfoProps {
  ticket: any;
}

const TicketInfo = ({ ticket }: TicketInfoProps) => {
  const getCategoryLabel = (category: string) => {
    const labels = {
      support: 'Suporte Técnico',
      sales: 'Vendas',
      logistics: 'Entregas (Logística)',
      financial: 'Financeiro',
      general: 'Geral'
    };
    return labels[category] || "Geral";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Aberto',
      in_progress: 'Em andamento',
      resolved: 'Resolvido',
      closed: 'Fechado'
    };
    return labels[status] || "Aberto";
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: 'Baixa',
      medium: 'Normal',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return labels[priority] || "Normal";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{ticket.subject}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <TicketStatusBadge status={ticket.status} label={getStatusLabel(ticket.status)} />
            <TicketPriorityBadge priority={ticket.priority} label={getPriorityLabel(ticket.priority)} />
            <TicketCategoryBadge category={ticket.category} label={getCategoryLabel(ticket.category)} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Descrição</h3>
          <p className="text-sm whitespace-pre-line">{ticket.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Informações do Cliente</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Nome:</span> {ticket.customer?.full_name || "N/A"}</p>
              <p><span className="font-medium">Email:</span> {ticket.customer?.email || "N/A"}</p>
              <p><span className="font-medium">Telefone:</span> {ticket.customer?.phone || "N/A"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Informações do Chamado</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">ID:</span> {ticket.id}</p>
              <p><span className="font-medium">Criado em:</span> {formatDate(ticket.created_at)}</p>
              <p><span className="font-medium">Última atualização:</span> {formatDate(ticket.updated_at)}</p>
              <p>
                <span className="font-medium">Atribuído para:</span>{" "}
                {ticket.assigned?.full_name || "Não atribuído"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketInfo;
