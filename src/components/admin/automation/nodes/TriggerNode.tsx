
import { Handle, Position } from 'reactflow';
import { LucideIcon } from 'lucide-react';
import { UserPlus, CreditCard, MessageCircle, Calendar } from 'lucide-react';

interface TriggerNodeProps {
  data: {
    label: string;
    service: string;
    action: string;
    icon?: string;
  };
  selected: boolean;
}

const TriggerNode = ({ data, selected }: TriggerNodeProps) => {
  // Mapeamento dos ícones
  const icons: Record<string, LucideIcon> = {
    UserPlus,
    CreditCard,
    MessageCircle,
    Calendar
  };

  // Função para obter o ícone correto
  const getIcon = () => {
    // Tentar obter o ícone pelo nome
    if (data.icon && icons[data.icon]) {
      const Icon = icons[data.icon];
      return <Icon className="h-4 w-4" />;
    }

    // Fallback baseado no serviço
    switch (data.service) {
      case 'crm':
        return <UserPlus className="h-4 w-4" />;
      case 'orders':
        return <CreditCard className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      case 'scheduler':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className={`px-4 py-2 rounded-md min-w-[180px] shadow-sm border-2 ${selected ? 'border-primary' : 'border-primary/40'} bg-primary/10`}>
      <div className="flex items-center gap-2">
        <div className="p-1 bg-primary/20 rounded-md text-primary">
          {getIcon()}
        </div>
        <div>
          <div className="text-xs font-semibold">GATILHO</div>
          <div className="text-sm">{data.label}</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#10b981', width: '8px', height: '8px', border: '2px solid #ffffff' }}
      />
    </div>
  );
};

export default TriggerNode;
