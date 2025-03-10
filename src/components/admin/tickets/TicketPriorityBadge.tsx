
import { Badge } from "@/components/ui/badge";

interface TicketPriorityBadgeProps {
  priority: string;
}

const TicketPriorityBadge = ({ priority }: TicketPriorityBadgeProps) => {
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

export default TicketPriorityBadge;
