
import { Badge } from "@/components/ui/badge";

interface TicketPriorityBadgeProps {
  priority: string;
  label?: string; // Adicionado prop opcional label
}

const TicketPriorityBadge = ({ priority, label }: TicketPriorityBadgeProps) => {
  // Se label for fornecido, use-o; caso contrário, use valores padrão
  const getLabel = () => {
    if (label) return label;
    
    switch (priority) {
      case "high": return "Alta";
      case "normal": return "Normal";
      case "low": return "Baixa";
      case "urgent": return "Urgente";
      default: return "Normal";
    }
  };
  
  switch (priority) {
    case "high":
      return <Badge variant="destructive">{getLabel()}</Badge>;
    case "normal":
      return <Badge variant="warning">{getLabel()}</Badge>;
    case "low":
      return <Badge variant="secondary">{getLabel()}</Badge>;
    case "urgent":
      return <Badge variant="destructive">{getLabel()}</Badge>;
    default:
      return <Badge variant="secondary">{getLabel()}</Badge>;
  }
};

export default TicketPriorityBadge;
