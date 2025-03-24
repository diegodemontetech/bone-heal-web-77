
import { useState, useEffect, useRef } from "react";
import { WhatsAppMessage } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, FileText, PaperclipIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WhatsAppChatProps } from "./types";

export const WhatsAppChat = ({
  messages,
  isLoading,
  onSendMessage,
  onMessageSent,
  selectedLead
}: WhatsAppChatProps) => {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      setSending(true);
      await onSendMessage(messageText);
      setMessageText("");
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (message: WhatsAppMessage) => {
    const isFromUser = message.sent_by === "user" || message.isFromMe;
    
    return (
      <div
        key={message.id}
        className={`flex ${isFromUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            isFromUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {message.media_url && message.media_type && (
            <div className="mb-2">
              {message.media_type.includes("image") ? (
                <img 
                  src={message.media_url} 
                  alt="Imagem" 
                  className="max-w-full rounded"
                />
              ) : message.media_type === "document" || (message.type && message.type === "document") ? (
                <a 
                  href={message.media_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Ver documento
                </a>
              ) : (
                <a 
                  href={message.media_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <PaperclipIcon className="h-4 w-4 mr-1" />
                  Ver anexo
                </a>
              )}
            </div>
          )}
          <div className="whitespace-pre-wrap">{message.message || message.body}</div>
          <div 
            className={`text-xs mt-1 ${
              isFromUser ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {format(new Date(message.created_at || message.timestamp || ""), "HH:mm", { locale: ptBR })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-lg font-medium">
          {selectedLead ? selectedLead.name || selectedLead.phone : "Chat WhatsApp"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span>Carregando mensagens...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhuma mensagem encontrada
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-end space-x-2">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
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
              disabled={!messageText.trim() || sending}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppChat;
