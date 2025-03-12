
import { Badge } from "@/components/ui/badge";

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Alta</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Média</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Baixa</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Padrão</Badge>;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aberto</Badge>;
    case "in_progress":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Em Andamento</Badge>;
    case "resolved":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Resolvido</Badge>;
    case "closed":
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Fechado</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
};
