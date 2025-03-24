
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";

export const useTickets = () => {
  const { profile, isAdminMaster, hasPermission } = useAuth();
  const queryClient = useQueryClient();

  // Configurar assinatura para atualizações em tempo real
  useEffect(() => {
    const subscription = supabase
      .channel('tickets-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'support_tickets' 
        }, 
        () => {
          // Quando houver mudanças, invalidar cache e refazer a consulta
          queryClient.invalidateQueries({queryKey: ["tickets"]});
          
          // Notificar o usuário sobre novos tickets
          toast("Atualização de tickets", {
            description: "Novos tickets ou atualizações recebidas",
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Buscar tickets com filtros - sem restrição por usuário para administradores
  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      console.log("Buscando tickets para admin, isAdmin:", isAdminMaster || profile?.is_admin);
      
      try {
        // Consulta simples sem joins automáticos
        const { data, error } = await supabase
          .from("support_tickets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar tickets:", error);
          throw error;
        }
        
        // Agora vamos buscar os dados relacionados manualmente para cada ticket
        const ticketsWithRelations = await Promise.all(data.map(async (ticket) => {
          // Buscar dados do cliente
          let customer = null;
          if (ticket.customer_id) {
            const { data: customerData, error: customerError } = await supabase
              .from("profiles")
              .select("id, full_name, email, phone")
              .eq("id", ticket.customer_id)
              .single();
              
            if (!customerError) {
              customer = customerData;
            } else {
              console.error(`Erro ao buscar cliente para ticket ${ticket.id}:`, customerError);
            }
          }
          
          // Buscar dados do agente
          let assigned = null;
          if (ticket.assigned_to) {
            const { data: assignedData, error: assignedError } = await supabase
              .from("profiles")
              .select("id, full_name")
              .eq("id", ticket.assigned_to)
              .single();
              
            if (!assignedError) {
              assigned = assignedData;
            } else {
              console.error(`Erro ao buscar agente para ticket ${ticket.id}:`, assignedError);
            }
          }
          
          return {
            ...ticket,
            customer,
            assigned
          };
        }));
        
        console.log("Tickets encontrados:", ticketsWithRelations?.length);
        return ticketsWithRelations;
      } catch (error) {
        console.error("Erro ao processar tickets:", error);
        throw error;
      }
    },
  });

  // Verificar tickets com SLA comprometido
  useEffect(() => {
    if (tickets) {
      const currentTime = new Date().getTime();
      const ticketsWithSLAViolation = tickets.filter(ticket => {
        if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
        
        const lastUpdateTime = new Date(ticket.updated_at || ticket.created_at).getTime();
        const hoursSinceLastUpdate = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
        
        return hoursSinceLastUpdate > 24;
      });
      
      if (ticketsWithSLAViolation.length > 0) {
        toast(`${ticketsWithSLAViolation.length} tickets com SLA comprometido`, {
          description: "Existem tickets que precisam de atenção urgente.",
          variant: "destructive",
        });
      }
    }
  }, [tickets]);

  // Buscar agentes (usuários administradores)
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("is_admin", true);

      if (error) throw error;
      return data;
    },
  });

  // Atribuir um ticket a um agente
  const assignTicket = async (ticketId: string, agentId: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ assigned_to: agentId, status: 'in_progress' })
        .eq("id", ticketId);
      
      if (error) throw error;
      
      toast("Ticket atribuído com sucesso", {
        description: "O ticket foi atribuído e está em andamento",
      });
      
      refetch();
    } catch (error) {
      console.error("Erro ao atribuir ticket:", error);
      toast("Erro ao atribuir ticket", {
        description: "Não foi possível atribuir o ticket",
        variant: "destructive"
      });
    }
  };

  // Atualizar status do ticket
  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", ticketId);
      
      if (error) throw error;
      
      toast("Status atualizado", {
        description: `O ticket foi atualizado para ${status}`,
      });
      
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast("Erro ao atualizar status", {
        description: "Não foi possível atualizar o status do ticket",
        variant: "destructive"
      });
    }
  };

  return {
    tickets,
    isLoading,
    refetch,
    agents,
    profile,
    isAdminMaster,
    hasPermission,
    assignTicket,
    updateTicketStatus
  };
};
