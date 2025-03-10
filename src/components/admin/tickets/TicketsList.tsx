
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import TicketItem from "./TicketItem";

interface TicketsListProps {
  tickets?: any[];
  isLoading: boolean;
  categoryLabels: Record<string, string>;
}

const TicketsList = ({ 
  tickets = [], 
  isLoading, 
  categoryLabels 
}: TicketsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <TicketSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="mt-8 text-center p-8 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Nenhum ticket encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {tickets.map((ticket) => (
        <TicketItem 
          key={ticket.id} 
          ticket={ticket}
          categoryLabels={categoryLabels}
        />
      ))}
    </div>
  );
};

const TicketSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-2">
    <div className="flex justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-24" />
    </div>
    <Skeleton className="h-4 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-20" />
    </div>
  </div>
);

export default TicketsList;
