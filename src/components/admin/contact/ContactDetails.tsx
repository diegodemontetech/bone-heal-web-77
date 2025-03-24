
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContactDetailsProps {
  contact: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    created_at: string;
    replied: boolean;
    reply?: string;
    replied_at?: string;
  };
  onSendReply: (reply: string) => Promise<void>;
}

const ContactDetails = ({ contact, onSendReply }: ContactDetailsProps) => {
  const [reply, setReply] = useState(contact.reply || "");
  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await onSendReply(reply);
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Detalhes do Contato</CardTitle>
            {contact.replied ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Respondido
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                Aguardando
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <p className="mt-1">{contact.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data</h3>
              <p className="mt-1">
                {format(new Date(contact.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span>{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Assunto</h3>
            <p className="font-medium">{contact.subject}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Mensagem</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>

          {contact.replied && contact.reply && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Resposta ({contact.replied_at ? format(new Date(contact.replied_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "Enviada"})
              </h3>
              <div className="p-4 bg-primary/10 rounded-lg whitespace-pre-wrap">
                {contact.reply}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responder</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            rows={5}
            disabled={sending || contact.replied}
            className={contact.replied ? "bg-gray-100" : ""}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSendReply}
            disabled={!reply.trim() || sending || contact.replied}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Enviar Resposta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactDetails;
