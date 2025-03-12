
import React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessagesProps } from "@/components/admin/whatsapp/types";

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-muted-foreground">Carregando mensagens...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-muted-foreground">Nenhuma mensagem para exibir</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};
