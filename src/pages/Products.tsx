
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Loader2 } from "lucide-react";

export default function Products() {
  const [filters, setFilters] = useState({
    search: "",
    priceRange: [0, 1000],
    category: "",
    sortBy: "name-asc",
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order(filters.sortBy.split("-")[0], {
          ascending: filters.sortBy.split("-")[1] === "asc",
        });

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.priceRange) {
        query = query
          .gte("price", filters.priceRange[0])
          .lte("price", filters.priceRange[1]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <aside className="w-full md:w-64 shrink-0">
            <ProductFilters onFilterChange={setFilters} />
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !products?.length ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">
                  Nenhum produto encontrado com os filtros selecionados.
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
