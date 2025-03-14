
import { Button } from "@/components/ui/button";
import { Plus, Search, X } from "lucide-react";

interface NoFlowsMessageProps {
  onCreateNew: () => void;
  hasSearch?: boolean;
  onClearSearch?: () => void;
}

const NoFlowsMessage = ({ onCreateNew, hasSearch, onClearSearch }: NoFlowsMessageProps) => {
  return (
    <div className="text-center py-8 border rounded-lg">
      {hasSearch ? (
        <>
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum fluxo de trabalho encontrado com este termo de busca</p>
          {onClearSearch && (
            <Button variant="outline" onClick={onClearSearch}>
              <X className="mr-2 h-4 w-4" /> Limpar Busca
            </Button>
          )}
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">Nenhum fluxo de trabalho encontrado</p>
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Fluxo
          </Button>
        </>
      )}
    </div>
  );
};

export default NoFlowsMessage;
