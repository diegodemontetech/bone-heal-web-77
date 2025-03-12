
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatInputProps } from "@/components/admin/whatsapp/types";

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  
  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={disabled || isSending}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={disabled || !message.trim() || isSending}
        size="icon"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
