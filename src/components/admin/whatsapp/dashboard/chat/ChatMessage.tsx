
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessageProps } from "@/components/admin/whatsapp/types";

export const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  const messageTime = message.created_at || message.timestamp;
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarFallback className="bg-muted">
            {message.sender?.full_name?.[0] || "C"}
          </AvatarFallback>
        </Avatar>
      )}
      <div>
        <div
          className={`max-w-[280px] sm:max-w-md rounded-lg p-3 shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm">{message.message}</div>
        </div>
        <div 
          className={`text-xs mt-1 ${
            isUser ? "text-right text-primary/70" : "text-muted-foreground"
          }`}
        >
          {messageTime && formatDistanceToNow(new Date(messageTime), { 
            addSuffix: true,
            locale: ptBR
          })}
          {message.sender?.full_name && !isUser && (
            <span className="ml-1 font-medium"> · {message.sender.full_name}</span>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {message.sender?.full_name?.[0] || "A"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
