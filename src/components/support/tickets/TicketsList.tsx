
import TicketCard from "./TicketCard";
import EmptyTicketsState from "./EmptyTicketsState";

interface TicketsListProps {
  tickets: any[];
  loading: boolean;
  activeTab: string;
  onCreateTicket: () => void;
  getPriorityBadge: (priority: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

const TicketsList = ({ 
  tickets, 
  loading, 
  activeTab, 
  onCreateTicket,
  getPriorityBadge,
  getStatusBadge 
}: TicketsListProps) => {
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return <EmptyTicketsState activeTab={activeTab} onCreateTicket={onCreateTicket} />;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard 
          key={ticket.id}
          ticket={ticket} 
          getPriorityBadge={getPriorityBadge} 
          getStatusBadge={getStatusBadge} 
        />
      ))}
    </div>
  );
};

export default TicketsList;
