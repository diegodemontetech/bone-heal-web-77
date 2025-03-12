
import React from "react";
import WhatsAppChat from "@/components/admin/whatsapp/WhatsAppChat";
import { WhatsAppMessage } from "@/components/admin/whatsapp/types";

interface ChatTabProps {
  messages: WhatsAppMessage[];
  messagesLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  selectedInstanceId: string | null;
}

const ChatTab = ({
  messages,
  messagesLoading,
  onSendMessage,
  selectedInstanceId,
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
      isLoading={messagesLoading}
      onSendMessage={onSendMessage}
      selectedLead={null}
    />
  );
};

export default ChatTab;
