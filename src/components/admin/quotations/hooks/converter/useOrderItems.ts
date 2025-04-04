
import { supabase } from "@/integrations/supabase/client";

export const useOrderItems = () => {
  const prepareOrderItems = async (quotationItems: any[]) => {
    if (!Array.isArray(quotationItems) || quotationItems.length === 0) return [];
    
    // Map todos os itens para suas versões enriquecidas
    return Promise.all(quotationItems.map(async (item) => {
      // Se tem produto_id, buscar detalhes adicionais do produto
      if (item.product_id) {
        const { data: product } = await supabase
          .from("products")
          .select("*")
          .eq("id", item.product_id)
          .single();
        
        return {
          product_id: item.product_id,
          name: item.product_name || product?.name,
          quantity: item.quantity,
          price: item.unit_price || product?.price,
          omie_code: product?.omie_code || null,
          product_image: product?.main_image || product?.default_image_url
        };
      }
      
      // Se não tem product_id, usar apenas os dados do item
      return {
        product_id: null,
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        omie_code: null
      };
    }));
  };

  return { prepareOrderItems };
};
