
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Headset, MessageSquare, Plus } from "lucide-react";
import TicketCategorySelect from "@/components/support/tickets/TicketCategorySelect";
import { useState } from "react";

export const SupportButtonsSection = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("support");

  const handleOpenTicket = () => {
    navigate(`/support/tickets/new?category=${category}`);
  };

  const handleViewTickets = () => {
    navigate("/support/tickets");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <TicketCategorySelect 
          value={category} 
          onValueChange={setCategory} 
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleOpenTicket}
          variant="default"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Abrir Chamado
        </Button>
        <Button
          onClick={handleViewTickets}
          variant="outline"
          className="w-full"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Ver Chamados
        </Button>
      </div>
    </div>
  );
};
