
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  status: string;
  source: string;
  created_at: string;
  notes?: string;
  last_contact?: string;
  assigned_to?: string;
  orders?: any[];
}

export const useLeadsQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads-kanban"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_leads")
        .select(`
          *,
          orders: profiles(id).orders(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar leads:", error);
        throw new Error("Não foi possível carregar os leads");
      }

      // Ajustar status para clientes sem status definido corretamente
      const transformedData = data.map((lead: any) => {
        // Se não tiver status definido para o pipeline
        if (!["negociacao", "primeira_compra", "novo_orcamento", "pedido", "pedido_pago", "ativos", "esfriando", "em_negociacao"].includes(lead.status)) {
          // Mapear status do banco para o status do Kanban
          if (lead.status === "new") return { ...lead, status: "negociacao" };
          if (lead.status === "contacted") return { ...lead, status: "negociacao" };
          if (lead.status === "closed") return { ...lead, status: "pedido_pago" };
          return { ...lead, status: "negociacao" }; // Default
        }
        return lead;
      });

      return transformedData as Lead[];
    }
  });

  return {
    leads: data,
    isLoading,
    error,
    refetch
  };
};
