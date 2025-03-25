
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing product image URLs
 */
export const useProductImage = () => {
  /**
   * Get a proper image URL from various image sources
   */
  const getProductImageUrl = (mainImage?: string, defaultImageUrl?: string): string => {
    const fallbackImage = "/placeholder.svg";
    
    if (!mainImage) {
      return defaultImageUrl || fallbackImage;
    }
    
    if (mainImage.startsWith('http')) {
      return mainImage;
    }
    
    try {
      // Extract the filename if it's a full path
      const pathParts = mainImage.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
      
      console.log(`Generated URL for ${mainImage}: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao obter URL da imagem:", error);
      return fallbackImage;
    }
  };

  return {
    getProductImageUrl
  };
};
