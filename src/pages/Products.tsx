import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductHero from "@/components/ProductHero";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Get active products with stock from Omie
      const { data: omieProducts, error: omieError } = await supabase
        .functions
        .invoke('omie-products')

      if (omieError) {
        console.error('Erro ao buscar produtos do Omie:', omieError);
        throw omieError;
      }

      console.log('Produtos do Omie:', omieProducts);

      // Get products from database that match Omie products
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in('id', omieProducts.products.map((p: any) => p.codigo));
      
      if (error) {
        console.error('Erro ao buscar produtos do banco:', error);
        throw error;
      }

      console.log('Produtos do banco:', data);

      // Merge Omie stock data with database products
      return data.map(product => ({
        ...product,
        stock: omieProducts.products.find((p: any) => p.codigo === product.id)?.estoque || 0
      }));
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProductHero />
        
        <section className="py-16 px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !products || products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Nenhum produto disponível
                  </h2>
                  <p className="text-gray-600">
                    No momento não há produtos cadastrados.
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;