
import { useParams } from "react-router-dom";
import TicketDetailsComponent from "@/components/support/TicketDetails";

const TicketDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>ID do chamado não encontrado</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow p-6">
        <TicketDetailsComponent ticketId={id} />
      </div>
    </div>
  );
};

export default TicketDetailsPage;
