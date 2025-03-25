
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  is_from_customer: boolean;
  message: string;
  created_at: string;
  sender: {
    full_name?: string;
    role?: string;
  };
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.is_from_customer ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex max-w-[80%] ${msg.is_from_customer ? 'flex-row-reverse' : 'flex-row'} items-start`}>
            <div className={`flex-shrink-0 ${msg.is_from_customer ? 'ml-3' : 'mr-3'} mt-1`}>
              <Avatar>
                <AvatarFallback className={msg.is_from_customer ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                  {msg.sender?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className={`rounded-lg p-4 shadow-sm ${
                msg.is_from_customer 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted rounded-tl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
              <div className={`text-xs text-muted-foreground mt-2 ${
                msg.is_from_customer ? 'text-right' : 'text-left'
              }`}>
                <span>{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ptBR })}</span>
                {" · "}
                <span className="font-medium">{msg.sender?.full_name || "Usuário"}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
