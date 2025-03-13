
import { Handle, Position } from "reactflow";
import { UserPlus, CreditCard, MessageCircle, Calendar } from "lucide-react";

// Definição das props para o nó de gatilho
interface TriggerNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
  };
  selected: boolean;
}

// Função para obter ícone baseado no serviço/ação
const getIcon = (service: string, action: string) => {
  if (service === "crm") return <UserPlus className="h-4 w-4" />;
  if (service === "orders") return <CreditCard className="h-4 w-4" />;
  if (service === "whatsapp") return <MessageCircle className="h-4 w-4" />;
  if (service === "scheduler") return <Calendar className="h-4 w-4" />;
  
  // Ícone padrão
  return <UserPlus className="h-4 w-4" />;
};

// Componente para o nó de gatilho no fluxo
const TriggerNode = ({ data, selected }: TriggerNodeProps) => {
  return (
    <div
      className={`rounded-md border border-slate-300 bg-white shadow-sm w-[220px] ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      <div className="p-3 border-b bg-primary text-white rounded-t-md">
        <div className="flex items-center gap-2">
          {getIcon(data.service, data.action)}
          <span className="font-medium">Gatilho: {data.label || "Novo Gatilho"}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">
          Serviço: {data.service || "crm"}
        </div>
        <div className="text-xs text-muted-foreground">
          Ação: {data.action || "newLead"}
        </div>
      </div>

      {/* Handle de saída (source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-primary border-primary"
      />
    </div>
  );
};

export default TriggerNode;
