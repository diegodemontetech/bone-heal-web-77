
import { Handle, Position } from "reactflow";
import { 
  Mail, 
  MessageCircle, 
  Database, 
  Bell, 
  FileText 
} from "lucide-react";

interface ActionNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
    icon?: string;
  };
  selected: boolean;
}

const ActionNode = ({ data, selected }: ActionNodeProps) => {
  const getIcon = () => {
    switch (data.service) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className={`px-4 py-2 rounded-md min-w-[180px] shadow-sm border-2 ${selected ? 'border-blue-600' : 'border-blue-400'} bg-blue-50`}>
      <div className="flex items-center gap-2">
        <div className="p-1 bg-blue-100 rounded-md text-blue-600">
          {getIcon()}
        </div>
        <div>
          <div className="text-xs font-semibold text-blue-700">AÇÃO</div>
          <div className="text-sm">{data.label}</div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#3b82f6', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#3b82f6', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
    </div>
  );
};

export default ActionNode;
