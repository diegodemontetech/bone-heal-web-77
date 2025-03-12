
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ChatMessageProps } from "@/components/admin/whatsapp/types";
import { ptBR } from "date-fns/locale";

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isFromMe = message.is_sent_by_me || message.direction === 'outbound';
  const formattedTime = message.timestamp 
    ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true, locale: ptBR })
    : '';
  
  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isFromMe
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="break-words">
          {message.body || message.message}
        </div>
        <div className={`text-xs mt-1 ${isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
