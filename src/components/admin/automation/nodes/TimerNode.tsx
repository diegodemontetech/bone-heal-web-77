
import { Handle, Position } from "reactflow";
import { Clock, Calendar, Infinity, Timer } from "lucide-react";

interface TimerNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
    icon?: string;
  };
  selected: boolean;
}

const TimerNode = ({ data, selected }: TimerNodeProps) => {
  const getIcon = () => {
    switch (data.action) {
      case 'delay':
        return <Clock className="h-4 w-4" />;
      case 'schedule':
        return <Calendar className="h-4 w-4" />;
      case 'cron':
        return <Infinity className="h-4 w-4" />;
      case 'sla':
        return <Timer className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className={`px-4 py-2 rounded-md min-w-[180px] shadow-sm border-2 ${selected ? 'border-purple-600' : 'border-purple-400'} bg-purple-50`}>
      <div className="flex items-center gap-2">
        <div className="p-1 bg-purple-100 rounded-md text-purple-600">
          {getIcon()}
        </div>
        <div>
          <div className="text-xs font-semibold text-purple-700">TEMPORIZADOR</div>
          <div className="text-sm">{data.label}</div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#9333ea', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#9333ea', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
    </div>
  );
};

export default TimerNode;
