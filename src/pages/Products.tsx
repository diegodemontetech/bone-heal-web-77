
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductFilters, FilterValues } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const initialFilters: FilterValues = {
  sortBy: "price-asc",
};

// Only select the fields we need
const PRODUCT_FIELDS = `
  id,
  name,
  slug,
  short_description,
  description,
  main_image,
  default_image_url,
  price,
  active
`.trim();

export default function Products() {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      console.log("Iniciando busca de produtos...", { filters });
      
      try {
        // Start with a base query
        let query = supabase
          .from("products")
          .select(PRODUCT_FIELDS)
          .eq('active', true);

        // Apply sorting
        if (filters.sortBy) {
          const [field, direction] = filters.sortBy.split("-");
          query = query.order(field, { ascending: direction === "asc" });
        }

        console.log("Executando query Supabase...");
        
        // Add timeout and abort controller
        const abortController = new AbortController();
        const timeout = setTimeout(() => {
          abortController.abort();
        }, 10000); // 10 second timeout

        const { data, error } = await query.abortSignal(abortController.signal);
        
        clearTimeout(timeout);

        if (error) {
          console.error("Erro ao buscar produtos do Supabase:", error);
          throw new Error(`Erro na busca: ${error.message}`);
        }

        if (!data) {
          console.log("Nenhum produto encontrado");
          return [];
        }

        console.log(`Query concluída com sucesso. ${data.length} produtos encontrados.`);
        return data as Product[];
      } catch (error) {
        console.error("Erro fatal na query de produtos:", error);
        // Re-throw with a clearer message
        throw new Error(error instanceof Error ? error.message : "Erro desconhecido ao buscar produtos");
      }
    },
    retry: false, // Disable retries
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    meta: {
      errorMessage: "Falha ao carregar produtos"
    }
  });

  console.log("Estado atual:", { 
    isLoading, 
    hasError: !!error, 
    errorMessage: error instanceof Error ? error.message : null,
    productsCount: products?.length 
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    console.log("Aplicando novos filtros:", newFilters);
    setFilters(newFilters);
  };

  // Handle errors with toast
  if (error) {
    toast({
      title: "Erro",
      description: error instanceof Error ? error.message : "Erro ao carregar produtos",
      variant: "destructive"
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <ProductFilters 
              onFilterChange={handleFilterChange} 
              initialValues={filters}
            />
          </aside>

          <div className="flex-1">
            {error ? (
              <div className="flex items-center justify-center h-96 flex-col gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : "Erro ao carregar produtos"}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !products?.length ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">
                  Nenhum produto encontrado.
                </p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
