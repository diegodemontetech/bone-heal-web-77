
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
  id: string;
  is_from_customer: boolean;
  message: string;
  created_at: string;
  sender: {
    full_name?: string;
    role?: string;
  };
}

interface MessagesSectionProps {
  messages: Message[];
  ticketStatus: string;
  onSendMessage: (message: string) => Promise<void>;
}

const MessagesSection = ({ messages, ticketStatus, onSendMessage }: MessagesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Mensagens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MessageList messages={messages} />
        <Separator className="my-6" />
        <MessageInput 
          ticketStatus={ticketStatus} 
          onSendMessage={onSendMessage} 
        />
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
