
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, User } from "lucide-react";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import { Badge } from "@/components/ui/badge";

interface TicketItemProps {
  ticket: any;
  categoryLabels: {
    status: Record<string, string>;
    priority: Record<string, string>;
    category: Record<string, string>;
  };
}

const TicketItem = ({ ticket, categoryLabels }: TicketItemProps) => {
  const navigate = useNavigate();

  // Verificar se o SLA está comprometido (mais de 24h sem atualização)
  const isSLABreached = () => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return false;
    }
    
    const lastUpdateTime = new Date(ticket.updated_at || ticket.created_at).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceLastUpdate = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
    
    return hoursSinceLastUpdate > 24;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getCategoryLabel = (category: string) => {
    return categoryLabels.category[category] || "Geral";
  };

  const handleTicketClick = () => {
    navigate(`/admin/tickets/${ticket.id}`);
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow duration-200 cursor-pointer ${isSLABreached() ? 'border-red-400' : ''}`}
      onClick={handleTicketClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="h-10 w-10 bg-primary/10 hidden sm:flex">
            <AvatarFallback className="text-primary">
              {ticket.customer ? getInitials(ticket.customer.full_name) : "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <h3 className="font-medium text-sm sm:text-base">{ticket.subject}</h3>
                {isSLABreached() && (
                  <Badge variant="destructive" className="ml-2 flex items-center">
                    <Bell className="w-3 h-3 mr-1" /> SLA
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <TicketStatusBadge status={ticket.status} label={categoryLabels.status[ticket.status]} />
                <TicketPriorityBadge priority={ticket.priority} label={categoryLabels.priority[ticket.priority]} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
              <div className="space-x-2">
                <span>
                  {ticket.customer ? ticket.customer.full_name : "Cliente não identificado"}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{getCategoryLabel(ticket.category)}</span>
              </div>
              <span className="text-xs mt-1 sm:mt-0">
                {format(new Date(ticket.created_at), "dd/MM/yyyy HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketItem;
