
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/types/crm";

export const useContactsQuery = (pipelineId: string | null) => {
  const { data: contacts, isLoading, refetch } = useQuery({
    queryKey: ["contacts", pipelineId],
    queryFn: async () => {
      if (!pipelineId) return [];
      
      try {
        const { data, error } = await supabase
          .from("crm_contacts")
          .select(`
            *,
            stage:stage_id (
              id,
              name,
              color,
              order_index,
              pipeline_id,
              created_at,
              updated_at
            ),
            responsible:responsible_id (
              id,
              full_name,
              email
            )
          `)
          .eq("pipeline_id", pipelineId)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Erro ao buscar contatos:", error);
          throw error;
        }
        
        // Buscar pedidos relacionados separadamente para cada lead
        const contactsWithOrders = await Promise.all(
          (data || []).map(async (contact) => {
            // Verificar se o contato tem um perfil associado pelo email ou whatsapp
            let profileIds: string[] = [];
            
            if (contact.email) {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", contact.email);
                
              if (profileData && profileData.length > 0) {
                profileIds = [...profileIds, ...profileData.map(p => p.id)];
              }
            }

            if (contact.whatsapp) {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("id")
                .eq("phone", contact.whatsapp);
                
              if (profileData && profileData.length > 0) {
                profileIds = [...profileIds, ...profileData.map(p => p.id)];
              }
            }
            
            if (profileIds.length > 0) {
              // Buscar pedidos para estes perfis
              const { data: orders, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .in("user_id", profileIds);
                
              if (ordersError) {
                console.error(`Erro ao buscar pedidos para contato ${contact.id}:`, ordersError);
                return { ...contact, orders: [] };
              }
              
              return { ...contact, orders: orders || [] };
            }
            
            return { ...contact, orders: [] };
          })
        );
        
        // Cast to Contact[] after ensuring the structure matches the expected type
        return contactsWithOrders as unknown as Contact[];
      } catch (error) {
        console.error("Erro na consulta de contatos:", error);
        throw error;
      }
    },
    enabled: !!pipelineId,
  });

  return { contacts: contacts || [], isLoading, refetch };
};
