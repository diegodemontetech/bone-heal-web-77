
import { Button } from "@/components/ui/button";
import { Headset, Plus } from "lucide-react";

interface EmptyTicketsStateProps {
  activeTab: string;
  onCreateTicket: () => void;
}

const EmptyTicketsState = ({ activeTab, onCreateTicket }: EmptyTicketsStateProps) => {
  return (
    <div className="text-center py-16">
      <Headset className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
      <h3 className="text-lg font-medium">Nenhum chamado encontrado</h3>
      <p className="text-muted-foreground mt-2 mb-6">
        Você ainda não possui chamados de suporte {activeTab !== "all" && `com status "${activeTab}"`}.
      </p>
      <Button onClick={onCreateTicket}>
        <Plus className="h-4 w-4 mr-2" />
        Criar Novo Chamado
      </Button>
    </div>
  );
};

export default EmptyTicketsState;
