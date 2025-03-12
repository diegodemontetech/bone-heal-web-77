
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || disabled || isSending) return;
    
    setIsSending(true);
    
    try {
      const success = await onSendMessage(message);
      if (success) {
        setMessage("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t bg-background flex gap-2 items-center">
      <Input
        placeholder={disabled ? "Selecione uma instância para enviar mensagens" : "Digite uma mensagem..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1"
      />
      <Button 
        onClick={handleSend} 
        disabled={disabled || !message.trim() || isSending}
        size="icon"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
