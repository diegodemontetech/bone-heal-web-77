
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductLandingPage from "@/components/product/ProductLandingPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import PageLoader from "@/components/PageLoader";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar produto:", error);
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Produto não encontrado</h2>
        <p className="mt-2 text-gray-600">
          O produto que você está procurando não existe.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProductLandingPage product={product} />
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default ProductPage;
