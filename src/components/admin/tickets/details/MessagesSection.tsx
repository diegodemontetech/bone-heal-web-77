
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MessagesSectionProps {
  messages: any[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

const MessagesSection = ({ messages, isLoading, onSendMessage }: MessagesSectionProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setSending(true);
      await onSendMessage(newMessage);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Mensagens
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversação.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  !message.is_from_customer ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    !message.is_from_customer ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${!message.is_from_customer ? "ml-2" : "mr-2"}`}>
                    <AvatarFallback className={`${!message.is_from_customer ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {getInitials(message.sender?.full_name || "Usuário")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`p-3 rounded-lg ${
                      !message.is_from_customer
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.sender?.full_name || "Usuário"}
                        </span>
                        <span className="text-xs ml-2">
                          {format(new Date(message.created_at), "HH:mm")}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{message.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="w-full">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            className="mb-2"
            rows={3}
            disabled={sending}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Enviar
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessagesSection;
