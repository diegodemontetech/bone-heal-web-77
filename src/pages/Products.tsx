
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductFilters, FilterValues } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Loader2 } from "lucide-react";

const initialFilters: FilterValues = {
  categories: ["todos"],
};

export default function Products() {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      console.log("Fetching products with filters:", filters);
      
      try {
        let query = supabase
          .from("products")
          .select("*")
          .eq("active", true);

        // Aplicar filtragem por categoria se não for "todos"
        if (!filters.categories.includes("todos") && filters.categories.length > 0) {
          // Assumindo que temos uma coluna "categories" no banco de dados
          // Precisamos verificar se qualquer uma das categorias selecionadas está presente
          query = query.or(
            filters.categories.map(cat => `categories.cs.{${cat}}`).join(",")
          );
        }

        // Aplicar ordenação
        if (filters.sortBy) {
          const [field, direction] = filters.sortBy.split("-");
          query = query.order(field, { ascending: direction === "asc" });
        } else {
          // Ordenação padrão
          query = query.order("name", { ascending: true });
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }

        if (!data) {
          console.log("No products found");
          return [] as Product[];
        }

        console.log("Products fetched:", data);
        return data as Product[];
      } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
      }
    },
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
            {isLoading ? (
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
