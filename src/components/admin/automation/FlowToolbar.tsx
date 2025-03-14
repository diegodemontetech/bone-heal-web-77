
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Play } from "lucide-react";

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
    <div className="bg-background p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Input
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="w-64 text-lg font-medium"
          disabled
        />
        <Badge variant={nodeCount > 0 ? "outline" : "secondary"}>
          {nodeCount} nós
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onExecute} 
          size="sm" 
          variant="outline"
          disabled={!canExecute}
        >
          <Play className="mr-2 h-4 w-4" /> Executar
        </Button>
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          size="sm"
        >
          <Save className="mr-2 h-4 w-4" /> {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default FlowToolbar;
