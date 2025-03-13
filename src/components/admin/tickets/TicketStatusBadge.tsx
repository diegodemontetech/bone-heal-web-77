
import { Badge } from "@/components/ui/badge";

interface TicketStatusBadgeProps {
  status: string;
  label?: string; // Adicionado prop opcional label
}

const TicketStatusBadge = ({ status, label }: TicketStatusBadgeProps) => {
  // Se label for fornecido, use-o; caso contrário, use valores padrão
  const getLabel = () => {
    if (label) return label;
    
    switch (status) {
      case "open": return "Aberto";
      case "in_progress": return "Em Andamento";
      case "resolved": return "Resolvido";
      case "closed": return "Fechado";
      default: return "Aberto";
    }
  };
  
  switch (status) {
    case "open":
      return <Badge variant="warning">{getLabel()}</Badge>;
    case "in_progress":
      return <Badge variant="info">{getLabel()}</Badge>;
    case "resolved":
      return <Badge variant="success">{getLabel()}</Badge>;
    case "closed":
      return <Badge>{getLabel()}</Badge>;
    default:
      return <Badge>{getLabel()}</Badge>;
  }
};

export default TicketStatusBadge;
