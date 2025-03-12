
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

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
    await onSendMessage(newMessage);
    setNewMessage("");
    setSending(false);
  };

  const isClosedOrResolved = ticketStatus === "resolved" || ticketStatus === "closed";

  return (
    <>
      {isClosedOrResolved ? (
        <div className="text-center py-4 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-2">
            Este chamado está {ticketStatus === "resolved" ? "resolvido" : "fechado"}. 
            Você pode reabri-lo enviando uma nova mensagem.
          </p>
          <div className="flex items-end space-x-2">
            <Textarea
              placeholder="Digite sua mensagem para reabrir este chamado..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 min-h-[80px]"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !newMessage.trim()}
              className="flex-shrink-0"
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
        <div className="flex items-end space-x-2">
          <Textarea
            placeholder="Digite sua mensagem aqui..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-[80px]"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !newMessage.trim()}
            className="flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default MessageInput;
