
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;
    
    try {
      setSending(true);
      await onSendMessage(message);
      setMessage('');
    } finally {
      setSending(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enviar no Enter sem Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          type="button"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Textarea
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-[2.5rem] resize-none"
        />
        
        <Button
          type="button"
          size="icon"
          className="rounded-full h-10 w-10"
          onClick={handleSendMessage}
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
