
import React from "react";
import { WhatsAppMessage } from "../../../types";

interface ChatMessageProps {
  message: WhatsAppMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSentByMe = message.is_sent_by_me || message.direction === 'outbound';
  const messageTime = message.timestamp || message.created_at || '';

  const formattedTime = messageTime ? new Date(messageTime).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : '';

  return (
    <div className={`flex my-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isSentByMe 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <p className="break-words">{message.body || message.message}</p>
        <p className={`text-xs mt-1 ${isSentByMe ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
};
