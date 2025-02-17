
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/products/ProductSearch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductHero from "@/components/ProductHero";
import { Loader2 } from "lucide-react";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", search, category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order('created_at', { ascending: false });

      // Aplicar filtro de categoria
      if (category !== "all") {
        query = query.eq("category", category);
      }

      // Aplicar busca por texto
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <ProductHero />

      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-8">
            <ProductSearch
              search={search}
              category={category}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
            />

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Erro ao carregar produtos</p>
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
