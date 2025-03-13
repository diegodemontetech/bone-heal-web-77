
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, PlusCircle } from "lucide-react";

interface NoFlowSelectedProps {
  onCreateNew?: () => void;
}

const NoFlowSelected = ({ onCreateNew }: NoFlowSelectedProps) => {
  return (
    <div className="h-[600px] border rounded-md flex flex-col items-center justify-center p-6">
      <div className="mb-4 p-3 rounded-full bg-muted">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nenhum fluxo selecionado</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Selecione um fluxo existente na lista ou crie um novo para começar a editar.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline">
          <Link to="/admin/automacoes">Voltar para Lista</Link>
        </Button>
        
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Fluxo
          </Button>
        )}
      </div>
    </div>
  );
};

export default NoFlowSelected;
