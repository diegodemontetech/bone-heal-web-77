
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send } from "lucide-react";

interface ContactDetailsProps {
  contact: any;
  onSendReply: (message: string) => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact, onSendReply }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setIsSubmitting(true);
      await onSendReply(replyMessage);
      setReplyMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Informações do Contato</span>
            <Badge variant={contact.status === "contacted" ? "success" : "secondary"}>
              {contact.status === "contacted" ? "Respondido" : "Aguardando"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
            <p className="text-base">{contact.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
            <p className="text-base">{contact.phone}</p>
          </div>
          {contact.email && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-base">{contact.email}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Assunto</h3>
            <p className="text-base">{contact.reason || "Não informado"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data do Contato</h3>
            <p className="text-base">
              {format(new Date(contact.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", {
                locale: ptBR,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mensagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <p className="whitespace-pre-wrap">{contact.message || "Sem mensagem"}</p>
          </div>

          {contact.status === "contacted" ? (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Resposta Enviada</h3>
              <div className="bg-primary/10 p-4 rounded-md">
                <p className="whitespace-pre-wrap text-primary-foreground">{contact.reply || contact.message}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Enviar Resposta</h3>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Escreva sua resposta aqui..."
                  rows={6}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!replyMessage.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Resposta
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetails;
