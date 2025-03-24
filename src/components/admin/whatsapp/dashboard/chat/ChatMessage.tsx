
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChatMessageProps } from "@/components/admin/whatsapp/types";

export const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  const messageTime = message.created_at || message.timestamp;
  const formattedTime = messageTime 
    ? format(new Date(messageTime), "HH:mm", { locale: ptBR }) 
    : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.message}</div>
        <div 
          className={`text-xs mt-1 ${
            isUser ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
