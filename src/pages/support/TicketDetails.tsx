
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Send, MessageSquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (profile?.id && id) {
      fetchTicketDetails();
      fetchMessages();
    }
  }, [profile, id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Verificar se o ticket pertence ao usuário atual
      if (data.customer_id !== profile?.id) {
        toast.error("Você não tem permissão para acessar este chamado");
        navigate("/support/tickets");
        return;
      }
      
      setTicket(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do ticket:", error);
      toast.error("Erro ao carregar detalhes do chamado");
      navigate("/support/tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select(`
          *,
          sender:sender_id(id, full_name, role)
        `)
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast.error("Erro ao carregar mensagens do chamado");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: id,
          sender_id: profile?.id,
          message: newMessage,
          is_from_customer: true
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar a lista de mensagens com a nova mensagem
      setMessages(prev => [...prev, {
        ...data,
        sender: {
          id: profile?.id,
          full_name: profile?.full_name,
          role: profile?.role
        }
      }]);
      
      // Limpar campo de mensagem
      setNewMessage("");

      // Se o ticket estiver resolvido ou fechado, reabri-lo
      if (ticket.status === "resolved" || ticket.status === "closed") {
        await updateTicketStatus("open");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const updateTicketStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      setTicket(prev => ({ ...prev, status }));
    } catch (error) {
      console.error("Erro ao atualizar status do ticket:", error);
      toast.error("Erro ao atualizar status do chamado");
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Padrão</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aberto</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Em Andamento</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolvido</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Fechado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">Chamado não encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate("/support/tickets")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para meus chamados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/support/tickets")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Chamados
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          Chamado #{id?.substring(0, 8)}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{ticket.subject}</CardTitle>
            <div className="flex space-x-2">
              {getPriorityBadge(ticket.priority)}
              {getStatusBadge(ticket.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição do Problema</h3>
              <p className="text-sm whitespace-pre-line">{ticket.description}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Criado em: {new Date(ticket.created_at).toLocaleDateString()} às {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-6">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversação.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_from_customer ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${msg.is_from_customer ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 ${msg.is_from_customer ? 'ml-3' : 'mr-3'}`}>
                      <Avatar>
                        <AvatarFallback>
                          {msg.sender?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className={`rounded-lg p-3 ${
                        msg.is_from_customer 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <div className={`text-xs text-muted-foreground mt-1 ${
                        msg.is_from_customer ? 'text-right' : 'text-left'
                      }`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {" · "}
                        <span>{msg.sender?.full_name || "Usuário"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Separator className="my-6" />

          {(ticket.status === "open" || ticket.status === "in_progress") ? (
            <div className="flex items-end space-x-2">
              <Textarea
                placeholder="Digite sua mensagem aqui..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 min-h-[80px]"
              />
              <Button 
                onClick={sendMessage} 
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
          ) : (
            <div className="text-center py-4 bg-muted rounded-lg">
              <p className="text-muted-foreground mb-2">
                Este chamado está {ticket.status === "resolved" ? "resolvido" : "fechado"}. 
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
                  onClick={sendMessage} 
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetails;
