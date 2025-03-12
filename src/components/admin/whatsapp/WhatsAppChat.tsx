
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { WhatsAppChatProps, WhatsAppMessage, convertMessageFormat } from "./types";

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage,
  selectedLead,
  onMessageSent
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Rolar para o final da conversa quando novas mensagens chegarem
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const success = await onSendMessage(newMessage);
      if (success) {
        setNewMessage("");
        if (onMessageSent) {
          onMessageSent();
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg">Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col h-[calc(100vh-300px)] max-h-[600px]">
          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length > 0 ? (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sent_by === "us" || msg.is_sent_by_me ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sent_by === "us" || msg.is_sent_by_me
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {(msg.media_url || msg.media_type) && (
                        <div className="mb-2">
                          {(msg.media_type?.startsWith("image/") || 
                            (msg.type === "image" && msg.media_url)) ? (
                            <img
                              src={msg.media_url}
                              alt="Media"
                              className="max-w-full rounded"
                            />
                          ) : (
                            <a
                              href={msg.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Ver anexo
                            </a>
                          )}
                        </div>
                      )}
                      <p className="break-words">{msg.message || msg.body}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sent_by === "us" || msg.is_sent_by_me
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.created_at || msg.timestamp || "").toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </>
            ) : (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                Nenhuma mensagem para exibir.
              </div>
            )}
          </div>
          
          {/* Área de input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                disabled={sending}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppChat;
