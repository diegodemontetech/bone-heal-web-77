
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Send } from "lucide-react";

interface ContactDetailsProps {
  contact: any;
  onSendReply: (message: string) => Promise<void>;
}

const ContactDetails = ({ contact, onSendReply }: ContactDetailsProps) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isReplied = contact.respondido || contact.replied;
  const replyText = contact.resposta || contact.reply;

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    
    setIsSending(true);
    try {
      await onSendReply(replyMessage);
      setReplyMessage("");
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Informações do Contato</CardTitle>
          {isReplied ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="mr-1 h-3 w-3" /> Respondido
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <AlertCircle className="mr-1 h-3 w-3" /> Aguardando resposta
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{contact.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{contact.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900">{contact.phone || "Não informado"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de envio</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(contact.created_at)}</dd>
            </div>
            {contact.subject && (
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Assunto</dt>
                <dd className="mt-1 text-sm text-gray-900">{contact.subject}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Mensagem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
            {contact.message}
          </div>
        </CardContent>
      </Card>

      {isReplied && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
              {replyText}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Respondido em {formatDate(contact.respondido_em || contact.replied_at)}
            </p>
          </CardContent>
        </Card>
      )}

      {!isReplied && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Enviar Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Digite sua resposta aqui..."
              className="min-h-32 mb-4"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <Button 
              onClick={handleSendReply} 
              disabled={!replyMessage.trim() || isSending}
              className="w-full sm:w-auto"
            >
              {isSending ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Resposta
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactDetails;
