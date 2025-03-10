
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq('active', true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
      
      return data || [];
    },
  });
};
