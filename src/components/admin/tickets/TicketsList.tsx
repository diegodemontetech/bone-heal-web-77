
import { Loader2, Bell } from "lucide-react";
import TicketItem from "./TicketItem";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TicketsListProps {
  tickets: any[] | null;
  isLoading: boolean;
  categoryLabels: {
    status: Record<string, string>;
    priority: Record<string, string>;
    category: Record<string, string>; // Campo category adicionado anteriormente
  };
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

  // Verificar tickets que estão com SLA comprometido (mais de 24h sem resposta)
  const currentTime = new Date().getTime();
  const hasOverdueSLA = tickets.some(ticket => {
    const lastUpdateTime = new Date(ticket.updated_at || ticket.created_at).getTime();
    const hoursSinceLastUpdate = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
    return (ticket.status === 'open' || ticket.status === 'in_progress') && hoursSinceLastUpdate > 24;
  });

  return (
    <div className="space-y-4">
      {hasOverdueSLA && (
        <Alert variant="destructive" className="mb-4">
          <Bell className="h-4 w-4 mr-2" />
          <AlertDescription>
            Existem tickets com tempo de resposta excedido. Favor verificar os tickets marcados com alerta de SLA.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {tickets.map((ticket) => (
          <TicketItem 
            key={ticket.id} 
            ticket={ticket} 
            categoryLabels={categoryLabels} 
          />
        ))}
      </div>
    </div>
  );
};

export default TicketsList;
