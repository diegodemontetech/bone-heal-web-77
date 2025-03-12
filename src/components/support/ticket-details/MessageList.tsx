
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
          <div className={`flex max-w-[80%] ${msg.is_from_customer ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 ${msg.is_from_customer ? 'ml-3' : 'mr-3'}`}>
              <Avatar>
                <AvatarFallback>
                  {msg.sender?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className={`rounded-lg p-3 ${
                msg.is_from_customer 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{msg.message}</p>
              </div>
              <div className={`text-xs text-muted-foreground mt-1 ${
                msg.is_from_customer ? 'text-right' : 'text-left'
              }`}>
                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {" · "}
                <span>{msg.sender?.full_name || "Usuário"}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
