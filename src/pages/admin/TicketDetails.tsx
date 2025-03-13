
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TicketInfo from "@/components/admin/tickets/details/TicketInfo";
import TicketActions from "@/components/admin/tickets/details/TicketActions";
import MessagesSection from "@/components/admin/tickets/details/MessagesSection";

const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(true);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
      fetchMessages();
      fetchAgents();
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      
      // Buscar o ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (ticketError) throw ticketError;
      
      // Buscar dados do cliente
      let customer = null;
      if (ticketData?.customer_id) {
        const { data: customerData } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone")
          .eq("id", ticketData.customer_id)
          .single();
        customer = customerData;
      }
      
      // Buscar dados do agente
      let assigned = null;
      if (ticketData?.assigned_to) {
        const { data: assignedData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("id", ticketData.assigned_to)
          .single();
        assigned = assignedData;
      }
      
      // Combinar os dados
      setTicket({
        ...ticketData,
        customer,
        assigned
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes do ticket:", error);
      toast.error("Erro ao carregar detalhes do chamado");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessageLoading(true);
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
    } finally {
      setMessageLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("is_admin", true);
      
      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
    }
  };

  const sendMessage = async (newMessage: string) => {
    try {
      if (!profile?.id) {
        toast.error("Você precisa estar logado para enviar mensagens");
        return;
      }

      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: id,
          sender_id: profile.id,
          message: newMessage,
          is_from_customer: false
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar a lista de mensagens com a nova mensagem
      setMessages(prev => [...prev, {
        ...data,
        sender: {
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role
        }
      }]);
      
      // Se o ticket estiver resolvido ou fechado, atualizá-lo para em andamento
      if (ticket.status === "resolved" || ticket.status === "closed") {
        await updateTicketStatus("in_progress");
      }

      toast.success("Mensagem enviada com sucesso");
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
      toast.success(`Status do chamado atualizado para ${status}`);
      fetchTicketDetails();
    } catch (error) {
      console.error("Erro ao atualizar status do ticket:", error);
      toast.error("Erro ao atualizar status do chamado");
    }
  };

  const assignTicket = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ 
          assigned_to: agentId,
          status: ticket.status === "open" ? "in_progress" : ticket.status 
        })
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Chamado atribuído com sucesso");
      fetchTicketDetails();
    } catch (error) {
      console.error("Erro ao atribuir ticket:", error);
      toast.error("Erro ao atribuir chamado");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/tickets")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Chamados
          </Button>
          <Skeleton className="h-8 w-48 ml-4" />
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/tickets")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Chamados
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <p className="text-muted-foreground">Chamado não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => navigate("/admin/tickets")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Chamados
          </Button>
          <h1 className="text-2xl font-bold ml-4">
            Chamado #{id?.substring(0, 8)}
          </h1>
        </div>
      </div>

      <div className="grid gap-6">
        <TicketInfo ticket={ticket} />
        
        <TicketActions 
          ticket={ticket} 
          agents={agents}
          onStatusChange={updateTicketStatus}
          onAssign={assignTicket}
        />
        
        <MessagesSection 
          messages={messages} 
          isLoading={messageLoading}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default AdminTicketDetails;
