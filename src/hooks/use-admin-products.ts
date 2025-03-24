
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";

export const useAdminProducts = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const { data: products = [], refetch, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      console.log("Fetching admin products...");
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }

        console.log("Admin products fetched successfully:", data);
        return data || [];
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast({
          title: "Erro ao carregar produtos",
          description: "Houve um problema ao buscar os produtos. Por favor, tente novamente.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: 1,
    initialData: [], 
    refetchOnWindowFocus: false,
  });

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      console.log(`Alterando status do produto ${id} de ${currentActive} para ${!currentActive}`);
      
      const { error } = await supabase
        .from("products")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar status do produto:", error);
        throw error;
      }

      toast({
        title: `Produto ${!currentActive ? "ativado" : "desativado"} com sucesso`,
      });
      
      // Forçar o refetch para atualizar a lista
      await refetch();
    } catch (error: any) {
      console.error("Erro ao alterar status do produto:", error);
      toast({
        title: "Erro ao alterar status do produto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Erro ao excluir produto",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Produto excluído com sucesso",
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Erro ao excluir produto",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const syncOmieProducts = async () => {
    try {
      setIsSyncing(true);
      console.log("Iniciando sincronização com Omie...");
      
      const { data, error } = await supabase.functions.invoke('omie-products');
      
      if (error) throw error;

      console.log("Resposta da sincronização:", data);
      
      if (data.success) {
        toast({
          title: "Sincronização concluída",
          description: data.message,
        });
        refetch();
      } else {
        throw new Error(data.error || "Erro desconhecido na sincronização");
      }
    } catch (error: any) {
      console.error("Erro na sincronização:", error);
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const openProductForm = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeProductForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    closeProductForm();
    refetch();
  };

  return {
    products,
    isLoading,
    error,
    isSyncing,
    isFormOpen,
    editingProduct,
    refetch,
    handleToggleActive,
    handleDelete,
    syncOmieProducts,
    openProductForm,
    closeProductForm,
    handleFormSuccess
  };
};
