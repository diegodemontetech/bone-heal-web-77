
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageBubbleProps {
  message: {
    id: string;
    direction: 'inbound' | 'outbound';
    message: string;
    created_at: string;
    sent_by?: 'agente' | 'bot' | string;
  };
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutbound = message.direction === 'outbound';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] p-3 rounded-lg ${
          isOutbound 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-white border shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        <div className={`text-xs mt-1 ${isOutbound ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {message.created_at && formatDistanceToNow(new Date(message.created_at), { 
            addSuffix: true,
            locale: ptBR
          })}
          {message.sent_by === 'agente' && ' • Enviado por atendente'}
          {message.sent_by === 'bot' && ' • Enviado por bot'}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
