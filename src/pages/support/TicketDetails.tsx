
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useAuth } from "@/hooks/use-auth-context";
import { TicketDetails as TicketDetailsComponent } from "@/components/support/TicketDetails";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  // Fetch ticket details
  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      if (!profile?.id || !id) return null;

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .eq('customer_id', profile.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id && !!id,
  });

  // Fetch ticket messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["ticket-messages", id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, user:user_id(full_name, is_admin)')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Add new message mutation
  const addMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!profile?.id || !id) throw new Error("Não autenticado");

      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: id,
          user_id: profile.id,
          message,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", id] });
      
      // Enviar notificação por email
      if (ticket) {
        try {
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-ticket-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              ticketNumber: ticket.number,
              subject: ticket.subject,
              message: newMessage,
              recipientEmail: profile?.email,
              recipientName: profile?.full_name,
              type: 'update',
            }),
          });
        } catch (error) {
          console.error("Erro ao enviar notificação por email:", error);
        }
      }
    },
    onError: (error) => {
      toast.error(`Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  const handleSubmitMessage = () => {
    if (!newMessage.trim()) return;
    addMessageMutation.mutate(newMessage);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="warning">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="info">Em Andamento</Badge>;
      case "resolved":
        return <Badge variant="success">Resolvido</Badge>;
      case "closed":
        return <Badge>Fechado</Badge>;
      default:
        return <Badge>Aberto</Badge>;
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Faça login para acessar seus tickets de suporte.</p>
          <Button onClick={() => navigate("/login")}>Fazer Login</Button>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/support/tickets")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Tickets
        </Button>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !ticket ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Ticket não encontrado</h3>
            <p className="text-gray-500 mb-4">
              O ticket solicitado não existe ou você não tem permissão para acessá-lo.
            </p>
            <Button onClick={() => navigate("/support/tickets")}>
              Ver meus tickets
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span>
                      Ticket #{ticket.number} • Criado {formatDistanceToNow(new Date(ticket.created_at), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 min-h-[300px] max-h-[500px] overflow-y-auto">
              {messagesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : messages?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Nenhuma mensagem encontrada
                </div>
              ) : (
                <div className="space-y-6">
                  {messages?.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${
                        message.user?.is_admin ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.user?.is_admin
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-primary text-white'
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">
                          {message.user?.is_admin 
                            ? 'Atendente' 
                            : 'Você'}
                        </div>
                        <p className="whitespace-pre-wrap">{message.message}</p>
                        <div className="text-xs mt-2 opacity-70">
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(ticket.status === 'open' || ticket.status === 'in_progress') && (
              <div className="p-6 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSubmitMessage} 
                    disabled={!newMessage.trim() || addMessageMutation.isPending}
                  >
                    {addMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
