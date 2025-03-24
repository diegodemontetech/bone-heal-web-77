
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessages } from "../dashboard/chat/ChatMessages";
import { ChatInput } from "../dashboard/chat/ChatInput";
import { ChatTabProps } from "@/components/admin/whatsapp/types";
import { WhatsAppChat } from "@/components/admin/whatsapp/WhatsAppChat";

const ChatTab = ({
  messages, 
  onSendMessage, 
  isLoading,
  messagesLoading,
  selectedInstanceId
}: ChatTabProps) => {
  if (!selectedInstanceId) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">
          Selecione uma instância para ver o chat
        </p>
      </div>
    );
  }

  return (
    <WhatsAppChat
      messages={messages}
      isLoading={messagesLoading || isLoading}
      onSendMessage={onSendMessage}
      selectedLead={null}
    />
  );
};

export default ChatTab;
