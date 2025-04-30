
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const fetchProductBySlug = async (slug?: string): Promise<Product | null> => {
  if (!slug) return null;
  
  try {
    console.log('Buscando produto pelo slug:', slug);
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (error) {
      console.error("Erro ao buscar produto pelo slug:", error);
      return null;
    }
    
    console.log('Produto encontrado:', data);
    return data as Product;
  } catch (error) {
    console.error("Erro na busca do produto:", error);
    return null;
  }
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq('active', true);
    
    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error("Erro na busca de produtos:", error);
    return [];
  }
}
