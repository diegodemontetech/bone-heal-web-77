
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  message: string;
  created_at: string;
  user: {
    full_name: string;
    is_admin: boolean;
  };
}

interface TicketDetailsProps {
  ticket: {
    id: string;
    number: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
  };
  messages: Message[];
}

export function TicketDetails({ ticket, messages }: TicketDetailsProps) {
  if (!ticket) return null;

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${
            message.user?.is_admin ? 'justify-start' : 'justify-end'
          }`}
        >
          <div 
            className={`max-w-[80%] rounded-lg p-4 ${
              message.user?.is_admin
                ? 'bg-gray-200 text-gray-800'
                : 'bg-primary text-white'
            }`}
          >
            <div className="font-medium text-sm mb-1">
              {message.user?.is_admin 
                ? 'Atendente' 
                : 'Você'}
            </div>
            <p className="whitespace-pre-wrap">{message.message}</p>
            <div className="text-xs mt-2 opacity-70">
              {formatDistanceToNow(new Date(message.created_at), { 
                addSuffix: true,
                locale: ptBR
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
