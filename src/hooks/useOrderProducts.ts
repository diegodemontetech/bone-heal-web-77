
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderProducts = () => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar produtos com filtro de pesquisa
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: async () => {
      console.log("Buscando produtos com filtro:", searchTerm);
      let query = supabase
        .from("products")
        .select("*");
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      query = query.order("name");

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao buscar produtos");
        return [];
      }
      
      console.log(`Encontrados ${data?.length || 0} produtos`);
      return data || [];
    },
  });

  const handleProductQuantityChange = (product: any, quantity: number) => {
    if (quantity > 0) {
      setSelectedProducts((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, quantity } : p
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } else {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
    }
  };

  return {
    products,
    isLoadingProducts,
    searchTerm,
    setSearchTerm,
    selectedProducts,
    setSelectedProducts,
    handleProductQuantityChange
  };
};
