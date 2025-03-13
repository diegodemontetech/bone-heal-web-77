
import { useState } from "react";
import { MessageSquare, Send, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MessagesSectionProps {
  messages: any[];
  ticketStatus: string;
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

const MessagesSection = ({ messages, ticketStatus, onSendMessage, isLoading = false }: MessagesSectionProps) => {
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

  const isTicketClosed = ticketStatus === "closed";

  return (
    <Card className="mt-6">
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
                className={`p-4 rounded-lg ${
                  message.is_from_customer
                    ? "bg-primary/10 ml-8 mr-0"
                    : "bg-gray-100 ml-0 mr-8"
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="font-medium">
                    {message.sender?.full_name || "Usuário"}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {isTicketClosed ? (
          <Alert className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este chamado está fechado. Não é possível enviar novas mensagens.
            </AlertDescription>
          </Alert>
        ) : (
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
        )}
      </CardFooter>
    </Card>
  );
};

export default MessagesSection;
