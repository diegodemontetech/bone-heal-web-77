
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Interface para os dados do cliente com tipagem melhorada
export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
}

// Enum para status de orçamento
export enum QuotationStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  CONVERTED = "converted"
}

// Interface para item do orçamento
export interface QuotationItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Interface para os dados do orçamento com tipagem melhorada
export interface Quotation {
  id: string;
  created_at: string;
  customer: CustomerProfile | null;
  status: QuotationStatus;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  sent_by_email: boolean;
  items: QuotationItem[];
  subtotal_amount: number;
}

export const useQuotationsQuery = () => {
  return useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      try {
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
            sent_by_email,
            items,
            subtotal_amount
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar orçamentos:", error);
          throw new Error(`Não foi possível carregar os orçamentos: ${error.message}`);
        }
        
        // Transformar a resposta com tipagem forte e tratamento de dados consistente
        return (data || []).map(quotation => {
          // Garantir que customer seja um objeto e não um array
          const customerData = Array.isArray(quotation.customer) 
            ? (quotation.customer.length > 0 ? quotation.customer[0] : null)
            : quotation.customer;
          
          // Garantir que items seja um array
          let items: QuotationItem[] = [];
          if (quotation.items) {
            if (Array.isArray(quotation.items)) {
              items = quotation.items.map(item => ({
                product_id: String(item.product_id || ''),
                product_name: String(item.product_name || ''),
                quantity: Number(item.quantity || 0),
                unit_price: Number(item.unit_price || 0),
                total_price: Number(item.total_price || 0)
              }));
            } else if (typeof quotation.items === 'string') {
              try {
                const parsedItems = JSON.parse(quotation.items);
                if (Array.isArray(parsedItems)) {
                  items = parsedItems.map(item => ({
                    product_id: String(item.product_id || ''),
                    product_name: String(item.product_name || ''),
                    quantity: Number(item.quantity || 0),
                    unit_price: Number(item.unit_price || 0),
                    total_price: Number(item.total_price || 0)
                  }));
                }
              } catch (e) {
                console.error("Erro ao parsear items:", e);
              }
            }
          }
          
          // Converter valores numéricos corretamente
          const total_amount = typeof quotation.total_amount === 'number' 
            ? quotation.total_amount 
            : parseFloat(quotation.total_amount || '0');
          
          const discount_amount = typeof quotation.discount_amount === 'number' 
            ? quotation.discount_amount 
            : parseFloat(quotation.discount_amount || '0');
          
          const subtotal_amount = typeof quotation.subtotal_amount === 'number' 
            ? quotation.subtotal_amount 
            : parseFloat(quotation.subtotal_amount || '0');
            
          const result: Quotation = {
            id: quotation.id,
            created_at: quotation.created_at,
            customer: customerData,
            items,
            total_amount,
            discount_amount,
            subtotal_amount,
            payment_method: quotation.payment_method || '',
            sent_by_email: Boolean(quotation.sent_by_email),
            status: (quotation.status || QuotationStatus.DRAFT) as QuotationStatus
          };
          
          return result;
        });
      } catch (error) {
        console.error("Erro ao processar dados de orçamentos:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
