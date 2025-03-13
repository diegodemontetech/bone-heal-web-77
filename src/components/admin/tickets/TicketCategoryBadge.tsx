
import { Badge } from "@/components/ui/badge";

interface TicketCategoryBadgeProps {
  category: string;
  label?: string;
}

const TicketCategoryBadge = ({ category, label }: TicketCategoryBadgeProps) => {
  // Se label for fornecido, use-o; caso contrário, use valores padrão
  const getLabel = () => {
    if (label) return label;
    
    switch (category) {
      case "support": return "Suporte Técnico";
      case "sales": return "Vendas";
      case "logistics": return "Entregas";
      case "financial": return "Financeiro";
      default: return "Geral";
    }
  };
  
  switch (category) {
    case "support":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">{getLabel()}</Badge>;
    case "sales":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">{getLabel()}</Badge>;
    case "logistics":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{getLabel()}</Badge>;
    case "financial":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">{getLabel()}</Badge>;
    default:
      return <Badge variant="secondary">{getLabel()}</Badge>;
  }
};

export default TicketCategoryBadge;
