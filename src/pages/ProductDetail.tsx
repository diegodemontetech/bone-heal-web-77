
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Play } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import { useBrowseHistory } from "@/hooks/use-browse-history";
import { useEffect } from "react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToHistory } = useBrowseHistory();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
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
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar produto:', error);
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
    retry: false,
    meta: {
      errorMessage: "Erro ao carregar produto"
    },
    gcTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 1 // 1 minute
  });

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar produto");
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
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Produto não encontrado
            </h1>
            <p className="text-neutral-600 mb-8">
              O produto que você está procurando não existe ou foi removido.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>
          
          <div className="mt-16">
            <ProductTabs product={product} />
          </div>

          {product.video_url && (
            <div className="mt-8">
              <a
                href={product.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Play className="w-5 h-5" />
                Assistir vídeo do produto
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
