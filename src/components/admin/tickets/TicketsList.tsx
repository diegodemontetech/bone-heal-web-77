
import { Loader2 } from "lucide-react";
import TicketItem from "./TicketItem";

interface TicketsListProps {
  tickets: any[] | null;
  isLoading: boolean;
  categoryLabels: Record<string, string>;
}

const TicketsList = ({ tickets, isLoading, categoryLabels }: TicketsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tickets?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhum ticket encontrado</h3>
        <p className="text-gray-500">
          Não há tickets correspondentes aos critérios de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
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

export default TicketsList;
