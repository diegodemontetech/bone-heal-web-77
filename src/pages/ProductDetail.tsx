
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useAuth } from "@/hooks/use-auth-context";
import ProductDetailContent from "@/components/product/ProductDetailContent";
import ProductLoading from "@/components/product/ProductLoading";
import ProductNotFound from "@/components/product/ProductNotFound";
import { fetchProductBySlug } from "@/api/product-api";
import { toast } from "sonner";
import { formatProductName } from "@/utils/product-formatters";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        console.log("Buscando produto com slug:", slug);
        
        if (!slug) {
          throw new Error("Slug não fornecido");
        }
        
        const product = await fetchProductBySlug(slug);
        
        if (!product) {
          console.log("Produto não encontrado");
          return null;
        }
        
        // Update product name to ensure correct formatting
        if (product.name) {
          product.name = formatProductName(product.name);
        }
        
        console.log("Produto encontrado:", product);
        return product;
      } catch (error) {
        console.error("Falha ao buscar produto:", error);
        toast.error("Não foi possível carregar as informações do produto");
        throw error;
      }
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/products")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para produtos
        </Button>

        {isLoading ? (
          <ProductLoading />
        ) : error || !product ? (
          <ProductNotFound />
        ) : (
          <ProductDetailContent product={product} profile={profile} />
        )}
      </div>
      
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
