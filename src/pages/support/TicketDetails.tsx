
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";

// Componentes refatorados
import TicketHeader from "@/components/support/ticket-details/TicketHeader";
import TicketInfo from "@/components/support/ticket-details/TicketInfo";
import MessagesSection from "@/components/support/ticket-details/MessagesSection";
import NotFoundState from "@/components/support/ticket-details/NotFoundState";
import LoadingState from "@/components/support/ticket-details/LoadingState";
import { getPriorityBadge, getStatusBadge } from "@/components/support/ticket-details/BadgeUtils";

const TicketDetails = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        return;
      }
      
      setTicket(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do ticket:", error);
      toast.error("Erro ao carregar detalhes do chamado");
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

  const sendMessage = async (newMessage: string) => {
    try {
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
      
      // Se o ticket estiver resolvido ou fechado, reabri-lo
      if (ticket.status === "resolved" || ticket.status === "closed") {
        await updateTicketStatus("open");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
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

  if (loading) {
    return <LoadingState />;
  }

  if (!ticket) {
    return <NotFoundState />;
  }

  return (
    <div className="container max-w-4xl py-10">
      <TicketHeader id={id} />
      
      <TicketInfo 
        ticket={ticket} 
        getPriorityBadge={getPriorityBadge} 
        getStatusBadge={getStatusBadge} 
      />
      
      <MessagesSection 
        messages={messages} 
        ticketStatus={ticket.status} 
        onSendMessage={sendMessage} 
      />
    </div>
  );
};

export default TicketDetails;
