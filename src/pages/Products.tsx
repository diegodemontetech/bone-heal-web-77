
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
  sortBy: "price-asc",
};

export default function Products() {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      console.log("Fetching products with filters:", filters);
      
      let query = supabase
        .from("products")
        .select("*")
        .eq('active', true)
        .order(filters.sortBy.split("-")[0], {
          ascending: filters.sortBy.split("-")[1] === "asc",
        });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Products fetched:", data);
      return data as Product[];
    },
  });

  const handleFilterChange = (newFilters: FilterValues) => {
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
