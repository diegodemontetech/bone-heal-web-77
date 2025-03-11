
import { useTickets } from "@/hooks/admin/use-tickets";
import CreateTicketDialog from "@/components/admin/tickets/CreateTicketDialog";
import TicketsContent from "@/components/admin/tickets/TicketsContent";

const AdminTickets = () => {
  const { tickets, isLoading, refetch, agents } = useTickets();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
        <CreateTicketDialog onSuccess={refetch} />
      </div>

      <TicketsContent 
        tickets={tickets} 
        isLoading={isLoading} 
        agents={agents} 
      />
    </div>
  );
};

export default AdminTickets;
