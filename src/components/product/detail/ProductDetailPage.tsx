
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadsterChat from "@/components/LeadsterChat";
import { Product } from "@/types/product";
import ProductDetailContent from "./ProductDetailContent";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import ProductNotFound from "./ProductNotFound";
import { fetchProductBySlug } from "@/services/product-service";
import { useEffect } from "react";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    console.log("ProductDetailPage - slug:", slug);
    console.log("ProductDetailPage - product:", product);
    console.log("ProductDetailPage - isLoading:", isLoading);
    console.log("ProductDetailPage - error:", error);
  }, [slug, product, isLoading, error]);

  const handleNavigateBack = () => {
    navigate("/produtos");
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound onNavigateBack={handleNavigateBack} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{product.name} | BoneHeal</title>
        <meta name="description" content={product.short_description || product.name} />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={handleNavigateBack}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar para produtos
          </Button>

          <ProductDetailContent product={product} />
        </div>
      </main>
      
      <Footer />
      <WhatsAppWidget />
      <LeadsterChat 
        title="Dúvidas sobre este produto?"
        message="Olá! Posso ajudar você com informações sobre este produto?"
      />
    </div>
  );
};

export default ProductDetailPage;
