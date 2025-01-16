import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";

const ProductsPreview = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products-preview"],
    queryFn: async () => {
      console.log('Iniciando busca de produtos...');
      
      // Get active products with stock from Omie
      const { data: omieProducts, error: omieError } = await supabase
        .functions
        .invoke('omie-products');

      if (omieError) {
        console.error('Erro ao buscar produtos do Omie:', omieError);
        throw omieError;
      }

      console.log('Produtos do Omie:', omieProducts);

      if (!omieProducts.products || omieProducts.products.length === 0) {
        console.log('Nenhum produto encontrado no Omie');
        return [];
      }

      // Get products from database that match Omie products
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in('id', omieProducts.products.map((p: any) => p.codigo))
        .limit(3);
      
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

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <p>Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Erro ao carregar produtos:', error);
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <p>Nenhum produto encontrado.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Nossos Produtos
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Conheça nossa linha de produtos inovadores para regeneração óssea
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products?.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            Ver Todos os Produtos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;