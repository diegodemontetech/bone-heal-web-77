
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";

interface TicketItemProps {
  ticket: any;
  categoryLabels: Record<string, string>;
}

const TicketItem = ({ ticket, categoryLabels }: TicketItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-medium">{ticket.subject}</h3>
            <span className="ml-2 text-xs text-gray-500">
              #{ticket.number}
            </span>
          </div>
          
          <p className="text-gray-600 mt-1 line-clamp-1">{ticket.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span className="inline-flex items-center mr-4">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(ticket.created_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
            <span className="inline-flex items-center mr-4">
              <MessageSquare className="w-4 h-4 mr-1" />
              {ticket.ticket_messages.length} mensagens
            </span>
            {ticket.category && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {categoryLabels[ticket.category] || ticket.category}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex space-x-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
          
          <div className="text-sm text-gray-600">
            {ticket.customer?.full_name}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="mr-2"
          onClick={() => window.open(`/support/tickets/${ticket.id}`, '_blank')}
        >
          Ver detalhes
        </Button>
        
        {ticket.status === 'open' && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Assumir ticket
          </Button>
        )}
        
        {ticket.status === 'in_progress' && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar como resolvido
          </Button>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
