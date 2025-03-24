
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatTabProps } from "@/components/admin/whatsapp/types";

export const ChatTab = ({ 
  messages, 
  onSendMessage, 
  isLoading,
  messagesLoading,
  selectedInstanceId
}: ChatTabProps) => {
  return (
    <div className="h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-lg font-medium">
            Mensagens
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          <ChatMessages 
            messages={messages}
            isLoading={messagesLoading || isLoading}
          />
          
          <ChatInput 
            onSendMessage={onSendMessage}
            isDisabled={!selectedInstanceId}
          />
        </CardContent>
      </Card>
    </div>
  );
};
