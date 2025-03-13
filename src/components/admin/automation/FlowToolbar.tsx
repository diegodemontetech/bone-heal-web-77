
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Play, Undo, Redo } from "lucide-react";

interface FlowToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  nodeCount: number;
  onSave: () => void;
  onExecute: () => void;
  isSaving: boolean;
  canExecute: boolean;
}

const FlowToolbar = ({
  flowName,
  onFlowNameChange,
  nodeCount,
  onSave,
  onExecute,
  isSaving,
  canExecute,
}: FlowToolbarProps) => {
  return (
    <div className="flex items-center gap-4 p-3 border-b bg-muted/20">
      <div className="flex-1">
        <Input
          placeholder="Nome do fluxo"
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>{nodeCount} nós</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          title="Executar Fluxo"
          onClick={onExecute}
          disabled={!canExecute}
        >
          <Play className="mr-1 h-4 w-4" />
          Executar
        </Button>

        <Button size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-1 h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FlowToolbar;
