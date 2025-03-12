
import React from "react";
import { cn } from "@/lib/utils";
import { WhatsAppMessage } from "../../../types";
import { format } from "date-fns";

interface ChatMessageProps {
  message: WhatsAppMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSentByMe = message.is_sent_by_me || message.direction === "outbound";
  const timestamp = message.timestamp || message.created_at || new Date().toISOString();
  const formattedTime = format(new Date(timestamp), "HH:mm");
  
  return (
    <div
      className={cn(
        "flex mb-4",
        isSentByMe ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-2",
          isSentByMe
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="break-words">{message.body || message.message}</div>
        <div
          className={cn(
            "text-xs mt-1",
            isSentByMe ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
