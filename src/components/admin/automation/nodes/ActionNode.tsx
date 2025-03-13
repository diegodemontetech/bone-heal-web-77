
import { Handle, Position } from "reactflow";
import { Mail, MessageCircle, Database, Bell, FileText } from "lucide-react";

// Definição das props para o nó de ação
interface ActionNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
  };
  selected: boolean;
}

// Função para obter ícone baseado no serviço/ação
const getIcon = (service: string, action: string) => {
  if (service === "email") return <Mail className="h-4 w-4" />;
  if (service === "whatsapp") return <MessageCircle className="h-4 w-4" />;
  if (service === "database") return <Database className="h-4 w-4" />;
  if (service === "notification") return <Bell className="h-4 w-4" />;
  if (service === "document") return <FileText className="h-4 w-4" />;
  
  // Ícone padrão
  return <Mail className="h-4 w-4" />;
};

// Componente para o nó de ação no fluxo
const ActionNode = ({ data, selected }: ActionNodeProps) => {
  return (
    <div
      className={`rounded-md border border-slate-300 bg-white shadow-sm w-[220px] ${
        selected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
    >
      <div className="p-3 border-b bg-blue-600 text-white rounded-t-md">
        <div className="flex items-center gap-2">
          {getIcon(data.service, data.action)}
          <span className="font-medium">Ação: {data.label || "Nova Ação"}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">
          Serviço: {data.service || "email"}
        </div>
        <div className="text-xs text-muted-foreground">
          Ação: {data.action || "sendEmail"}
        </div>
      </div>

      {/* Handle de entrada (target) */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-blue-500 border-blue-500"
      />

      {/* Handle de saída (source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-blue-500 border-blue-500"
      />
    </div>
  );
};

export default ActionNode;
