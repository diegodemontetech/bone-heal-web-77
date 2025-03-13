
import { Handle, Position } from "reactflow";
import { Filter, AlertTriangle } from "lucide-react";

// Definição das props para o nó de condição
interface ConditionNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
  };
  selected: boolean;
}

// Função para obter ícone baseado na ação
const getIcon = (action: string) => {
  if (action === "errorCheck") return <AlertTriangle className="h-4 w-4" />;
  
  // Ícone padrão
  return <Filter className="h-4 w-4" />;
};

// Componente para o nó de condição no fluxo
const ConditionNode = ({ data, selected }: ConditionNodeProps) => {
  return (
    <div
      className={`rounded-md border border-slate-300 bg-white shadow-sm w-[220px] ${
        selected ? "ring-2 ring-amber-500 ring-offset-2" : ""
      }`}
    >
      <div className="p-3 border-b bg-amber-600 text-white rounded-t-md">
        <div className="flex items-center gap-2">
          {getIcon(data.action)}
          <span className="font-medium">Condição: {data.label || "Nova Condição"}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">
          Serviço: {data.service || "logic"}
        </div>
        <div className="text-xs text-muted-foreground">
          Ação: {data.action || "filter"}
        </div>
      </div>

      {/* Handle de entrada (target) */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-amber-500 border-amber-500"
      />

      {/* Handle de saída para fluxo "verdadeiro" */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="left-[35%] w-3 h-3 bg-green-500 border-green-500"
      />

      {/* Handle de saída para fluxo "falso" */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="left-[65%] w-3 h-3 bg-red-500 border-red-500"
      />
    </div>
  );
};

export default ConditionNode;
