
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface NoFlowsMessageProps {
  onCreateNew: () => void;
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

const NoFlowsMessage = ({ 
  onCreateNew,
  hasSearch = false,
  onClearSearch
}: NoFlowsMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-3 rounded-full bg-muted">
        {hasSearch ? (
          <RefreshCw className="h-8 w-8 text-muted-foreground" />
        ) : (
          <PlusCircle className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      
      {hasSearch ? (
        <>
          <h3 className="text-lg font-medium mb-2">Nenhum fluxo encontrado</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Não foi possível encontrar fluxos com os termos de busca utilizados.
          </p>
          <Button onClick={onClearSearch}>Limpar Busca</Button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2">Nenhum fluxo criado</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Você ainda não criou nenhum fluxo de automação. Crie o primeiro para começar.
          </p>
          <Button onClick={onCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Fluxo
          </Button>
        </>
      )}
    </div>
  );
};

export default NoFlowsMessage;
