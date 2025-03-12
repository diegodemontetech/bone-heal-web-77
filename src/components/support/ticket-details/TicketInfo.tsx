
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketInfoProps {
  ticket: {
    subject: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
  };
  getPriorityBadge: (priority: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

const TicketInfo = ({ ticket, getPriorityBadge, getStatusBadge }: TicketInfoProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{ticket.subject}</CardTitle>
          <div className="flex space-x-2">
            {getPriorityBadge(ticket.priority)}
            {getStatusBadge(ticket.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição do Problema</h3>
            <p className="text-sm whitespace-pre-line">{ticket.description}</p>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Criado em: {new Date(ticket.created_at).toLocaleDateString()} às {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketInfo;
