
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductLandingPage from "@/components/product/ProductLandingPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import PageLoader from "@/components/PageLoader";
import { Product } from "@/types/product";

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

      // Convert technical_details if it's a string
      if (data && typeof data.technical_details === 'string') {
        try {
          data.technical_details = JSON.parse(data.technical_details);
        } catch (e) {
          console.warn('Failed to parse technical_details as JSON:', e);
          data.technical_details = {};
        }
      }

      // Add additional fields that might be needed by components
      const enhancedProduct: Product = {
        ...data,
        image_url: data.main_image || data.default_image_url,
        dimensions: extractDimensionsFromName(data.name),
        indication: getIndicationByDimensions(data.name),
        category: data.category_id
      };

      return enhancedProduct;
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

// Helper function to extract dimensions from product name
function extractDimensionsFromName(name?: string): string {
  if (!name) return '';
  const match = name.match(/(\d+)[xX](\d+)/);
  return match ? `${match[1]}mm x ${match[2]}mm` : '';
}

// Helper function to get indication by dimensions
function getIndicationByDimensions(name?: string): string {
  if (!name) return '';
  
  if (name.includes('15x40')) {
    return 'Exodontia unitária';
  } else if (name.includes('20x30')) {
    return 'Até 2 elementos contíguos';
  } else if (name.includes('30x40')) {
    return 'Até 3 elementos contíguos';
  }
  
  return '';
}

export default ProductPage;
