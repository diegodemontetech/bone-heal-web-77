
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessagesListProps {
  messages: any[];
  loading: boolean;
}

const MessagesList = ({ messages, loading }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rolar para o final quando mensagens forem adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOutgoing = message.direction === 'outgoing';
        
        return (
          <div 
            key={message.id}
            className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%]`}>
              <div
                className={`px-4 py-2 rounded-lg ${
                  isOutgoing 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                {message.is_bot && (
                  <div className="text-xs mb-1 font-medium">
                    {isOutgoing ? 'Bot' : 'Automático'}
                  </div>
                )}
                <p className="whitespace-pre-line">{message.message}</p>
              </div>
              
              <div className={`flex text-xs text-muted-foreground mt-1 ${
                isOutgoing ? 'justify-end' : 'justify-start'
              }`}>
                <span>
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
                {message.sender?.full_name && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{message.sender.full_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
