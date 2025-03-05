
import { supabase } from "@/integrations/supabase/client";
import { ProductFormValues } from "@/validators/product-schema";

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
