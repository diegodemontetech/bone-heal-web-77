
import React from "react";
import { WhatsAppMessage } from "../../../types";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Nenhuma mensagem para exibir
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};
