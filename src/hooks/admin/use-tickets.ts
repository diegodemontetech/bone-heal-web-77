
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { useToast } from "@/hooks/use-toast";

export const useTickets = () => {
  const { profile, isAdminMaster, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
          toast({
            title: "Atualização de tickets",
            description: "Novos tickets ou atualizações recebidas",
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Buscar tickets com filtros
  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          customer:customer_id(full_name, email),
          assigned:assigned_to(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
        toast({
          title: `${ticketsWithSLAViolation.length} tickets com SLA comprometido`,
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

  return {
    tickets,
    isLoading,
    refetch,
    agents,
    profile,
    isAdminMaster,
    hasPermission
  };
};
