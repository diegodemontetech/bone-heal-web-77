
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";
import { toast } from "sonner";

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
      
      // Processamento de dados antes de retornar
      return data.map(quotation => {
        // Garantir que products seja um array
        let products = [];
        try {
          products = parseJsonArray(quotation.products, []);
        } catch (e) {
          console.error("Erro ao analisar produtos:", e);
          products = [];
        }
        
        // Atualizar propriedades derivadas
        let subtotal = 0;
        products.forEach(product => {
          if (product && product.price && product.quantity) {
            subtotal += product.price * product.quantity;
          }
        });
        
        let discount = quotation.discount || 0;
        
        // Processar método de envio
        let shippingCost = 0;
        if (quotation.shipping_method) {
          let shippingMethod;
          try {
            // Se for string, tenta fazer o parse
            if (typeof quotation.shipping_method === 'string') {
              shippingMethod = JSON.parse(quotation.shipping_method);
            } 
            // Se já for objeto, usa diretamente
            else if (typeof quotation.shipping_method === 'object') {
              shippingMethod = quotation.shipping_method;
            }
            
            if (shippingMethod && shippingMethod.cost) {
              shippingCost = parseFloat(shippingMethod.cost);
            }
          } catch (e) {
            console.error("Erro ao analisar método de envio:", e);
          }
        }
        
        // Calcular total
        const total = subtotal - discount + shippingCost;
        
        // Retornar objeto processado
        return {
          ...quotation,
          products: products,
          subtotal: subtotal,
          discount: discount,
          shipping_cost: shippingCost,
          total: total
        };
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
