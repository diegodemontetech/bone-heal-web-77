
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface TicketCardProps {
  ticket: any;
  getPriorityBadge: (priority: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

const TicketCard = ({ ticket, getPriorityBadge, getStatusBadge }: TicketCardProps) => {
  return (
    <Link 
      key={ticket.id} 
      to={`/support/tickets/${ticket.id}`}
      className="block"
    >
      <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{ticket.subject}</h3>
          <div className="flex space-x-2">
            {getPriorityBadge(ticket.priority)}
            {getStatusBadge(ticket.status)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {ticket.description}
        </p>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>ID: #{ticket.id.substring(0, 8)}</span>
          <span>
            {new Date(ticket.created_at).toLocaleDateString()} às {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;
