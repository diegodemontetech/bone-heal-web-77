
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

export default function Products() {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const { toast } = useToast();

  // Query products from Supabase only
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      console.log("Fetching products with filters:", filters);
      
      let query = supabase
        .from("products")
        .select("*")
        .eq('active', true);

      // Apply sorting
      if (filters.sortBy) {
        const [field, direction] = filters.sortBy.split("-");
        query = query.order(field, { ascending: direction === "asc" });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products from Supabase:", error);
        throw error;
      }

      console.log("Products fetched successfully:", data?.length || 0, "products");
      return data as Product[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000, // Cache data for 1 minute
    gcTime: 300000, // Keep data for 5 minutes
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    console.log("Applying new filters:", newFilters);
    setFilters(newFilters);
  };

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
                  Ocorreu um erro ao carregar os produtos.
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
