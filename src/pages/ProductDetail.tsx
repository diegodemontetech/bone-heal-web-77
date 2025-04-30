
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadsterChat from "@/components/LeadsterChat";
import { Product } from "@/types/product";
import { formatProductName } from "@/utils/product-formatters";
import ProductBulletPoints from "@/components/product/ProductBulletPoints";
import ProductTechDetails from "@/components/product/ProductTechDetails";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        console.log("Buscando produto com slug:", slug);
        
        if (!slug) {
          throw new Error("Slug não fornecido");
        }
        
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (error || !data) {
          console.error("Erro ao buscar produto:", error);
          // Tentar buscar pelo ID caso o slug não funcione
          const { data: dataById } = await supabase
            .from("products")
            .select("*")
            .eq("id", slug)
            .single();
            
          if (!dataById) {
            throw new Error("Produto não encontrado");
          }
          
          return dataById as Product;
        }
        
        return data as Product;
      } catch (error) {
        console.error("Falha ao buscar produto:", error);
        toast.error("Não foi possível carregar as informações do produto");
        throw error;
      }
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p>Carregando informações do produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <p className="mb-6 text-gray-600">
              O produto que você está buscando não foi encontrado ou pode ter sido removido.
            </p>
            <Button onClick={() => navigate("/produtos")}>
              Ver todos os produtos
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format product name to show brand first with proper registration mark
  const formattedName = formatProductName(product.name);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{formattedName} | BoneHeal</title>
        <meta name="description" content={product.short_description || formattedName} />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/produtos")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar para produtos
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Image Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center">
              <img
                src={product.main_image ? `https://kurpshcdafxbyqnzxvxu.supabase.co/storage/v1/object/public/products/${product.main_image}` : product.default_image_url || "/placeholder.svg"}
                alt={formattedName}
                className="max-h-96 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{formattedName}</h1>
              
              <p className="text-lg text-gray-700">
                {product.short_description || product.description || "Membrana para regeneração óssea guiada."}
              </p>
              
              {product.price ? (
                <div className="mt-4">
                  <p className="text-3xl font-bold text-primary">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-gray-500">
                    ou em até 6x de R$ {(product.price / 6).toFixed(2).replace('.', ',')} sem juros
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-700">
                    Consulte preço com nossos vendedores
                  </p>
                </div>
              )}

              <ProductBulletPoints product={product} className="mt-6" />

              <div className="pt-6">
                <Button className="w-full py-6 text-lg" size="lg">
                  Solicitar Orçamento
                </Button>
                
                <div className="flex items-center justify-center mt-4">
                  <WhatsAppButton className="w-full" text="Falar com Consultor" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="space-y-12 mb-12">
            {/* Description */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Descrição</h2>
              <div className="prose max-w-none">
                <p>{product.full_description || product.description || "Sem descrição detalhada disponível."}</p>
              </div>
            </section>

            {/* Technical Details */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Especificações Técnicas</h2>
              <ProductTechDetails product={product} />
            </section>
          </div>
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

export default ProductDetail;
