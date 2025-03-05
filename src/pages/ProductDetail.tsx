
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ShoppingCart, Check, Loader2, Shield, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchProductBySlug } from "@/api/product-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ProductReviews from "@/components/product/ProductReviews";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import { Badge } from "@/components/ui/badge";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { profile } = useAuth();
  const [added, setAdded] = useState(false);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug || ""),
    enabled: !!slug,
  });

  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => {
        setAdded(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [added]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "/placeholder.svg",
    });

    setAdded(true);
    toast.success("Produto adicionado ao carrinho!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
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
        <div className="flex-1 container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <Button onClick={() => navigate("/products")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar para produtos
          </Button>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProductGallery
            mainImage={product.main_image || "/placeholder.svg"}
            gallery={product.gallery || []}
          />

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">Produto Médico</Badge>
              
              <h1 className="text-2xl font-heading font-bold mb-2">{product.name}</h1>
              
              <p className="text-gray-600 mb-4">
                {product.short_description}
              </p>
              
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="#FFBA00" 
                    className="w-5 h-5"
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
                <span className="text-sm font-medium text-gray-600">5.0 (10 avaliações)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              {profile ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Preço</span>
                    <span className="text-3xl font-bold text-primary">
                      R$ {product.price?.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      className="w-full py-6 text-base bg-green-600 hover:bg-green-700"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={added}
                    >
                      {added ? (
                        <>
                          <Check className="w-5 h-5 mr-2" /> Adicionado ao carrinho
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao carrinho
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="py-6 text-base border-primary text-primary hover:bg-primary/10"
                        onClick={() => navigate("/products")}
                      >
                        Continuar Comprando
                      </Button>
                      <Button
                        className="py-6 text-base bg-primary hover:bg-primary/90"
                        size="lg"
                        onClick={() => navigate("/cart")}
                      >
                        Finalizar Pedido
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                      <div className="flex flex-col items-center text-center">
                        <Truck className="h-5 w-5 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">Envio em 24h</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <Shield className="h-5 w-5 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">Produto original</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">Pagamento seguro</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-md border border-primary/10 mb-4">
                    <p className="text-sm text-center text-gray-700">
                      Faça login como dentista para ver os preços e realizar compras
                    </p>
                  </div>
                  
                  <Button
                    className="w-full py-6 text-base bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => navigate("/login")}
                  >
                    Fazer Login para Comprar
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                    <div className="flex flex-col items-center text-center">
                      <Truck className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-xs text-gray-600">Envio em 24h</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Shield className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-xs text-gray-600">Produto original</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <CreditCard className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-xs text-gray-600">Pagamento seguro</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <ProductTabs product={product} />
          </div>
          <div>
            <ProductReviews product={product} />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
