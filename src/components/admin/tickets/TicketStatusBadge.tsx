
import { Badge } from "@/components/ui/badge";

interface TicketStatusBadgeProps {
  status: string;
}

const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
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

export default TicketStatusBadge;
