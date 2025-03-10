
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles: Record<string, string> = {
    draft: "bg-gray-200 text-gray-800",
    sent: "bg-blue-200 text-blue-800",
    accepted: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
    expired: "bg-yellow-200 text-yellow-800"
  };

  const statusLabels: Record<string, string> = {
    draft: "Rascunho",
    sent: "Enviado",
    accepted: "Aceito",
    rejected: "Rejeitado",
    expired: "Expirado"
  };

  return (
    <Badge className={statusStyles[status] || "bg-gray-200"}>
      {statusLabels[status] || status}
    </Badge>
  );
};

export default StatusBadge;
