
import React from "react";
import { WhatsAppMessage } from "../../../types";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatTabProps {
  messages: WhatsAppMessage[];
  messagesLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  selectedInstanceId: string | null;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  messagesLoading,
  onSendMessage,
  selectedInstanceId,
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-240px)]">
      <ChatMessages 
        messages={messages} 
        isLoading={messagesLoading} 
      />
      <ChatInput 
        onSendMessage={onSendMessage} 
        disabled={!selectedInstanceId} 
      />
    </div>
  );
};
