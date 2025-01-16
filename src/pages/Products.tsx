import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductHero from "@/components/ProductHero";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log('Iniciando busca de produtos...');
      
      // Get products from database first
      const { data: dbProducts, error: dbError } = await supabase
        .from("products")
        .select("*");
      
      if (dbError) {
        console.error('Erro ao buscar produtos do banco:', dbError);
        throw dbError;
      }

      console.log('Produtos encontrados no banco:', dbProducts?.length || 0);
      console.log('Detalhes dos produtos:', JSON.stringify(dbProducts, null, 2));

      if (!dbProducts || dbProducts.length === 0) {
        console.log('Nenhum produto encontrado no banco');
        return [];
      }

      // Get active products with stock from Omie
      const { data: omieProducts, error: omieError } = await supabase
        .functions
        .invoke('omie-products');

      if (omieError) {
        console.error('Erro ao buscar produtos do Omie:', omieError);
        // Don't throw error here, just log it and continue with database products
        console.log('Continuando apenas com produtos do banco devido a erro do Omie');
        return dbProducts.map(product => ({
          ...product,
          stock: product.stock || 0
        }));
      }

      console.log('Produtos do Omie:', omieProducts);

      // Merge Omie stock data with database products
      return dbProducts.map(product => ({
        ...product,
        stock: omieProducts?.products?.find((p: any) => p.codigo === product.id)?.estoque || product.stock || 0
      }));
    },
  });

  if (error) {
    console.error('Erro ao carregar produtos:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <ProductHero />
          <section className="py-16 px-8">
            <div className="container mx-auto">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Erro ao carregar produtos
                </h2>
                <p className="text-gray-600">
                  Ocorreu um erro ao carregar os produtos. Por favor, tente novamente mais tarde.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
                    No momento não há produtos cadastrados em nosso catálogo.
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