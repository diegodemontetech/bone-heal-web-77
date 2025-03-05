import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import { useBrowseHistory } from "@/hooks/use-browse-history";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToHistory } = useBrowseHistory();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug, retryCount],
    queryFn: async () => {
      console.log('Buscando produto com slug:', slug);
      
      if (!slug) {
        console.error('Slug não fornecido');
        throw new Error('Slug não fornecido');
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (error) {
        console.error('Erro ao buscar produto:', error);
        if (error.code === 'PGRST116') {
          // PGRST116 significa que nenhum resultado foi encontrado
          return null;
        }
        throw error;
      }

      if (!data) {
        console.error('Produto não encontrado para o slug:', slug);
        return null;
      }

      console.log('Produto encontrado:', data);
      return data as Product;
    },
    enabled: !!slug,
    retry: 1,
    meta: {
      errorMessage: "Erro ao carregar produto"
    },
    gcTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 1 // 1 minute
  });

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Tentando carregar o produto novamente...");
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  useEffect(() => {
    if (error) {
      console.error("Erro detalhado:", error);
      toast.error("Erro ao carregar produto. Por favor, tente novamente mais tarde.");
    }
  }, [error]);

  useEffect(() => {
    if (product) {
      addToHistory(product);
    }
  }, [product, addToHistory]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Produto não encontrado
            </h1>
            <p className="text-neutral-600 mb-8">
              O produto que você está procurando não existe ou foi removido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Tentar novamente
              </button>
              <button
                onClick={handleBackToProducts}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Voltar para produtos
              </button>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className={`flex-grow ${isMobile ? 'pt-4' : 'pt-24'}`}>
        <div className="container mx-auto px-4">
          {isMobile && (
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
          )}
          
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <ProductGallery product={product} />
              <ProductInfo product={product} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-8">
            <ProductTabs product={product} />
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
