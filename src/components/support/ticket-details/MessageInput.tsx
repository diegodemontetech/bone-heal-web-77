
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MessageInputProps {
  ticketStatus: string;
  onSendMessage: (message: string) => Promise<void>;
}

const MessageInput = ({ ticketStatus, onSendMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  const isClosedOrResolved = ticketStatus === "resolved" || ticketStatus === "closed";

  return (
    <>
      {isClosedOrResolved ? (
        <div className="bg-muted/50 rounded-lg p-4 border border-muted-foreground/20">
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este chamado está {ticketStatus === "resolved" ? "resolvido" : "fechado"}. 
              Você pode reabri-lo enviando uma nova mensagem.
            </AlertDescription>
          </Alert>
          <div className="flex items-end space-x-2">
            <Textarea
              placeholder="Digite sua mensagem para reabrir este chamado..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 min-h-[100px] resize-none bg-white focus-visible:ring-primary"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !newMessage.trim()}
              className="flex-shrink-0 h-10"
              size="icon"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <Textarea
            placeholder="Digite sua mensagem aqui..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-[100px] resize-none mb-2 focus-visible:ring-primary"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !newMessage.trim()}
              className="flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageInput;
