
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Definir tipos para melhor tipagem e manutenibilidade
export interface CustomerProfile {
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface ProductItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  product_image?: string;
}

export interface ShippingInfo {
  method?: string;
  cost?: number;
  carrier?: string;
  days?: number;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface Quotation {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  customer: CustomerProfile | null;
  customer_info: Json;
  items: ProductItem[];
  shipping_info: ShippingInfo | null;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total_amount: number;
  sent_by_email: boolean;
  status: string;
  discount_type: string;
  payment_method: string;
  notes: string;
}

export const useQuotationsQuery = (status?: string) => {
  // Função para carregar cotações do Supabase
  const fetchQuotations = useCallback(async () => {
    try {
      let query = supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filtra por status se fornecido
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Processamento de dados para formato padronizado
      return data.map(quotation => {
        // Parse dos items (produtos)
        const items = parseJsonArray(quotation.items, []);
        
        // Parse das informações do cliente
        const customerInfo = quotation.customer_info ? 
          (typeof quotation.customer_info === 'string' ? 
            JSON.parse(quotation.customer_info) : quotation.customer_info) : null;
        
        // Parse das informações de envio
        const shippingInfo = quotation.shipping_info ? 
          (typeof quotation.shipping_info === 'string' ? 
            JSON.parse(quotation.shipping_info) : quotation.shipping_info) : null;
            
        // Calcular subtotal baseado nos itens
        let subtotal = 0;
        items.forEach((item: ProductItem) => {
          if (item && item.unit_price && item.quantity) {
            subtotal += item.unit_price * item.quantity;
          }
        });
        
        // Utilizar discount_amount do banco de dados
        const discountAmount = quotation.discount_amount || 0;
        
        // Calcular o custo de envio
        let shippingCost = 0;
        if (shippingInfo && shippingInfo.cost) {
          shippingCost = parseFloat(String(shippingInfo.cost));
        }
        
        // Calcular total (ou usar o valor do banco se disponível)
        const total = quotation.total_amount || (subtotal - discountAmount + shippingCost);
        
        // Retornar objeto processado e tipado
        return {
          ...quotation,
          customer: customerInfo,
          items: items,
          shipping_info: shippingInfo,
          subtotal: subtotal,
          discount_amount: discountAmount,
          shipping_cost: shippingCost,
          total: total
        } as Quotation;
      });
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
      toast.error("Erro ao carregar cotações");
      throw error;
    }
  }, [status]);

  return useQuery({
    queryKey: ['quotations', status],
    queryFn: fetchQuotations
  });
};
