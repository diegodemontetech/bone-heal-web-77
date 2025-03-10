
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Headset } from "lucide-react";

export const TicketsSection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Suporte</h2>
      <p className="text-sm text-muted-foreground">
        Acompanhe seus chamados de suporte ou abra um novo chamado.
      </p>
      <Button 
        onClick={() => navigate("/support/tickets")}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <Headset className="w-4 h-4 mr-2" />
        Meus Chamados
      </Button>
    </div>
  );
};
