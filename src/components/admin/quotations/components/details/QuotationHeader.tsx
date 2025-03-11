
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface QuotationHeaderProps {
  id: string;
  status: string;
  createdAt: string;
}

export const QuotationHeader = ({ id, status, createdAt }: QuotationHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Badge className={getStatusColor(status)}>
        {status.toUpperCase()}
      </Badge>
      <span className="text-sm text-muted-foreground">
        {format(new Date(createdAt), "dd/MM/yyyy")}
      </span>
    </div>
  );
};
