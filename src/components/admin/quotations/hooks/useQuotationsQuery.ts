
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Interface para os dados do cliente
export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

// Interface para os dados do orçamento
export interface Quotation {
  id: string;
  created_at: string;
  customer: CustomerProfile | null;
  status: string;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  sent_by_email: boolean;
}

export const useQuotationsQuery = () => {
  return useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          id,
          created_at,
          customer:profiles(id, full_name, email, phone),
          status,
          total_amount,
          discount_amount,
          payment_method,
          sent_by_email
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar orçamentos:", error);
        throw new Error("Não foi possível carregar os orçamentos");
      }
      
      // Transformar a resposta para garantir que customer seja um objeto e não um array
      return (data || []).map(quotation => {
        // Se customer é um array, pegue o primeiro item ou nulo se vazio
        const customerData = Array.isArray(quotation.customer) 
          ? (quotation.customer.length > 0 ? quotation.customer[0] : null)
          : quotation.customer;
          
        return {
          ...quotation,
          customer: customerData
        } as Quotation;
      });
    },
  });
};
