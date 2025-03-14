
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Workflow } from "lucide-react";

interface FlowToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  nodeCount: number;
}

const FlowToolbar = ({
  flowName,
  onFlowNameChange,
  nodeCount,
}: FlowToolbarProps) => {
  return (
    <div className="bg-background p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded-md flex items-center justify-center">
          <Workflow className="h-5 w-5 text-primary" />
        </div>
        <Input
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="w-64 text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
          placeholder="Nome do fluxo"
        />
        <Badge variant={nodeCount > 0 ? "outline" : "secondary"} className="ml-2">
          {nodeCount} {nodeCount === 1 ? "nó" : "nós"}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        Arraste elementos do painel à esquerda para o canvas
      </div>
    </div>
  );
};

export default FlowToolbar;
