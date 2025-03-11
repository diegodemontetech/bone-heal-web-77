
import { Handle, Position } from "reactflow";
import { Filter, AlertTriangle } from "lucide-react";

interface ConditionNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
    icon?: string;
  };
  selected: boolean;
}

const ConditionNode = ({ data, selected }: ConditionNodeProps) => {
  const getIcon = () => {
    switch (data.action) {
      case 'filter':
        return <Filter className="h-4 w-4" />;
      case 'errorCheck':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  return (
    <div className={`px-4 py-2 rounded-md min-w-[180px] shadow-sm border-2 ${selected ? 'border-amber-600' : 'border-amber-400'} bg-amber-50`}>
      <div className="flex items-center gap-2">
        <div className="p-1 bg-amber-100 rounded-md text-amber-600">
          {getIcon()}
        </div>
        <div>
          <div className="text-xs font-semibold text-amber-700">CONDIÇÃO</div>
          <div className="text-sm">{data.label}</div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#f59e0b', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="ml-[40%]"
        style={{ background: '#16a34a', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="ml-[60%]"
        style={{ background: '#dc2626', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
    </div>
  );
};

export default ConditionNode;
