
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NoFlowsMessageProps {
  onCreateNew: () => void;
}

const NoFlowsMessage = ({ onCreateNew }: NoFlowsMessageProps) => {
  return (
    <div className="text-center py-8 border rounded-lg">
      <p className="text-muted-foreground mb-4">Nenhum fluxo de trabalho encontrado</p>
      <Button onClick={onCreateNew}>
        <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Fluxo
      </Button>
    </div>
  );
};

export default NoFlowsMessage;
