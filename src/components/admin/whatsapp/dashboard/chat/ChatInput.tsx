
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { ChatInputProps } from "@/components/admin/whatsapp/types";

export const ChatInput = ({ onSendMessage, isDisabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || isDisabled) return;

    try {
      setSending(true);
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-end space-x-2 p-4 border-t">
      <Textarea
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending || isDisabled}
        className="resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || sending || isDisabled}
        size="icon"
        className="h-10 w-10 shrink-0"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
