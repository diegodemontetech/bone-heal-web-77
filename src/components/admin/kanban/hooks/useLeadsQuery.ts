
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLeadsQuery = (filter: string | null) => {
  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ["leads", filter],
    queryFn: async () => {
      try {
        // Consulta básica de leads
        let query = supabase
          .from("contact_leads")
          .select("*")
          .order("created_at", { ascending: false });

        // Aplicar filtro se fornecido
        if (filter) {
          query = query.eq("source", filter);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Erro ao buscar leads:", error);
          throw error;
        }
        
        // Buscar pedidos relacionados separadamente para cada lead
        const leadsWithOrders = await Promise.all(
          (data || []).map(async (lead) => {
            // Verificar se o lead tem um id de perfil associado
            if (lead.profile_id) {
              // Buscar pedidos para este perfil
              const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", lead.profile_id);
                
              if (ordersError) {
                console.error(`Erro ao buscar pedidos para lead ${lead.id}:`, ordersError);
                return { ...lead, orders: [] };
              }
              
              return { ...lead, orders: orders || [] };
            }
            
            return { ...lead, orders: [] };
          })
        );
        
        return leadsWithOrders;
      } catch (error) {
        console.error("Erro na consulta de leads:", error);
        throw error;
      }
    },
  });

  return { leads, isLoading, refetch };
};
