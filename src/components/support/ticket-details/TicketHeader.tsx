
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketHeaderProps {
  id: string | undefined;
}

const TicketHeader = ({ id }: TicketHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-6">
      <Button variant="outline" onClick={() => navigate("/support/tickets")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Chamados
      </Button>
      <h1 className="text-2xl font-bold ml-4">
        Chamado #{id?.substring(0, 8)}
      </h1>
    </div>
  );
};

export default TicketHeader;
