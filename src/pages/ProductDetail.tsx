
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductBySlug } from "@/api/product-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useAuth } from "@/hooks/use-auth-context";
import ProductDetailContent from "@/components/product/ProductDetailContent";
import ProductLoading from "@/components/product/ProductLoading";
import ProductNotFound from "@/components/product/ProductNotFound";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug || ""),
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
