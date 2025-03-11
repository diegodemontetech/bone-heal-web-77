
import { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface MessagesListProps {
  messages: any[];
  loading: boolean;
}

const MessagesList = ({ messages, loading }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma mensagem disponível.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <MessageBubble key={msg.id || index} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
