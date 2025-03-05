
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ShoppingCart, Check, Loader2 } from "lucide-react";
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
            <ProductInfo product={product} />

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Preço</span>
                <span className="text-3xl font-bold text-primary">
                  R$ {product.price?.toFixed(2)}
                </span>
              </div>

              {profile ? (
                <div className="space-y-3">
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
                        <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao
                        carrinho
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="py-6 text-base border-orange-500 text-orange-600 hover:bg-orange-50"
                      onClick={() => navigate("/products")}
                    >
                      Continuar Comprando
                    </Button>
                    <Button
                      className="py-6 text-base bg-orange-500 hover:bg-orange-600"
                      size="lg"
                      onClick={() => navigate("/cart")}
                    >
                      Finalizar Pedido
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Envio para todo o Brasil em até 48h
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Faça login para adicionar este produto ao carrinho
                  </p>
                  <Button
                    className="w-full py-6 text-base bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => navigate("/login")}
                  >
                    Fazer Login para Comprar
                  </Button>
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
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ProductDetail;
