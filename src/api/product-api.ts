
import { supabase } from "@/integrations/supabase/client";
import { ProductFormValues } from "@/validators/product-schema";
import { Product } from "@/types/product";

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }

  return data as Product;
};

export const checkExistingProduct = async (omieCode: string, productId?: string) => {
  const query = supabase
    .from("products")
    .select("id")
    .eq('omie_code', omieCode);
  
  if (productId) {
    query.neq('id', productId);
  }

  return await query.single();
};

export const updateProduct = async (productId: string, data: any) => {
  return await supabase
    .from("products")
    .update(data)
    .eq("id", productId);
};

export const createProduct = async (data: any) => {
  return await supabase
    .from("products")
    .insert([data]);
};

export const fetchProductReviews = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return [];
  }
};
