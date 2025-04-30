
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";

export async function fetchProductBySlug(slug?: string): Promise<Product> {
  try {
    console.log("Buscando produto com slug:", slug);
    
    if (!slug) {
      throw new Error("Slug não fornecido");
    }
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (error || !data) {
      console.error("Erro ao buscar produto:", error);
      // Tentar buscar pelo ID caso o slug não funcione
      const { data: dataById } = await supabase
        .from("products")
        .select("*")
        .eq("id", slug)
        .single();
        
      if (!dataById) {
        throw new Error("Produto não encontrado");
      }
      
      return dataById as Product;
    }
    
    return data as Product;
  } catch (error) {
    console.error("Falha ao buscar produto:", error);
    toast.error("Não foi possível carregar as informações do produto");
    throw error;
  }
}
