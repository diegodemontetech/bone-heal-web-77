
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles: Record<string, string> = {
    draft: "bg-neutral-100 text-neutral-700 border-neutral-200",
    sent: "bg-blue-50 text-blue-700 border-blue-100",
    accepted: "bg-green-50 text-green-700 border-green-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
    expired: "bg-amber-50 text-amber-700 border-amber-100"
  };

  const statusLabels: Record<string, string> = {
    draft: "Rascunho",
    sent: "Enviado",
    accepted: "Aceito",
    rejected: "Rejeitado",
    expired: "Expirado"
  };

  return (
    <Badge className={`${statusStyles[status] || "bg-neutral-100"} font-medium border`}>
      {statusLabels[status] || status}
    </Badge>
  );
};

export default StatusBadge;
