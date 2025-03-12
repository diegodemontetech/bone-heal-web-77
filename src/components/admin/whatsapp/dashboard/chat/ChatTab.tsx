
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatTabProps } from "@/components/admin/whatsapp/types";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { Loader2 } from "lucide-react";

export const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  messagesLoading, 
  onSendMessage,
  selectedInstanceId 
}) => {
  if (!selectedInstanceId) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-center text-muted-foreground">
            Selecione uma instância para visualizar o chat
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        {messagesLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessages messages={messages} isLoading={messagesLoading} />
          </div>
        )}
        <div className="p-4 border-t">
          <ChatInput 
            onSendMessage={onSendMessage} 
            disabled={messagesLoading} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
