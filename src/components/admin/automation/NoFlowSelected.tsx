
import { ArrowLeft, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoFlowSelectedProps {
  onCreateFlow?: () => void;
}

const NoFlowSelected = ({ onCreateFlow }: NoFlowSelectedProps) => {
  return (
    <div className="h-[600px] flex items-center justify-center border rounded-md bg-gray-50/50">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Workflow className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum fluxo selecionado</h3>
        <p className="text-muted-foreground mb-4">
          Selecione um fluxo existente para editar ou crie um novo para começar a automatizar seus processos de negócio.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {onCreateFlow && (
            <Button onClick={onCreateFlow} size="sm">
              Criar novo fluxo
            </Button>
          )}
          <div className="flex items-center gap-1 text-muted-foreground mt-2 sm:mt-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Selecione um fluxo na lista</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoFlowSelected;
