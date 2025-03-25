
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    <Card className="shadow-md">
      <CardHeader className="bg-muted/30 border-b pb-3 pt-4">
        <CardTitle className="flex items-center text-lg font-medium">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          Mensagens
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversação.
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  !message.is_from_customer ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start ${
                    !message.is_from_customer ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className={`h-8 w-8 mt-1 ${!message.is_from_customer ? "ml-2" : "mr-2"}`}>
                    <AvatarFallback className={`${!message.is_from_customer ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {getInitials(message.sender?.full_name || "Usuário")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`p-4 rounded-lg shadow-sm ${
                        !message.is_from_customer
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-gray-100 rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.message}</p>
                    </div>
                    <div className={`text-xs text-muted-foreground mt-2 ${
                      !message.is_from_customer ? "text-right" : "text-left"
                    }`}>
                      <span className="font-medium">{message.sender?.full_name || "Usuário"}</span>
                      {" · "}
                      <span>{formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true,
                        locale: ptBR
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 bg-muted/20 border-t">
        <div className="w-full">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            className="mb-3 resize-none focus-visible:ring-primary bg-white"
            rows={3}
            disabled={sending}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="flex items-center gap-2"
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
