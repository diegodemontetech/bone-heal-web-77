
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TicketsHeaderProps {
  onCreateTicket: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const TicketsHeader = ({ onCreateTicket, onRefresh, isRefreshing }: TicketsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate("/profile")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Perfil
        </Button>
        <h1 className="text-2xl font-bold">Meus Chamados de Suporte</h1>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button onClick={onCreateTicket}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Chamado
        </Button>
      </div>
    </div>
  );
};

export default TicketsHeader;
