
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";

export const useTickets = () => {
  const { profile, isAdminMaster, hasPermission } = useAuth();

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
