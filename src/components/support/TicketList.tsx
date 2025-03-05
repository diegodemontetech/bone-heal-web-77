
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Ticket {
  id: string;
  number: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  ticket_messages: { id: string }[];
}

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const navigate = useNavigate();

  if (!tickets.length) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhum ticket encontrado</h3>
        <p className="text-gray-500">
          Você ainda não possui tickets de suporte. Clique em "Novo Ticket" para criar um.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="warning">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="info">Em Andamento</Badge>;
      case "resolved":
        return <Badge variant="success">Resolvido</Badge>;
      case "closed":
        return <Badge>Fechado</Badge>;
      default:
        return <Badge>Aberto</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>;
      case "normal":
        return <Badge variant="warning">Normal</Badge>;
      case "low":
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id}
          onClick={() => navigate(`/support/tickets/${ticket.id}`)}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{ticket.subject}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="flex items-center mr-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(new Date(ticket.created_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {ticket.ticket_messages.length} mensagens
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center space-x-2">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
              <span className="text-xs text-gray-500">
                #{ticket.number}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
