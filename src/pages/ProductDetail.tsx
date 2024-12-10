import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, FileText, Award, Play } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });

  const handleAddToCart = () => {
    // Implementação do carrinho virá em seguida
    toast.success("Produto adicionado ao carrinho!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-neutral-600">Produto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Imagem Principal e Galeria */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <img
                  src={`/products/${product.main_image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-white shadow cursor-pointer hover:ring-2 ring-primary transition-all"
                    >
                      <img
                        src={`/products/${image}`}
                        alt={`${product.name} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Informações do Produto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold text-neutral-900">{product.name}</h1>
              
              <div className="prose prose-neutral max-w-none">
                <p className="text-lg text-neutral-600">{product.short_description}</p>
              </div>

              {product.certifications && product.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}

              <Button
                size="lg"
                className="w-full md:w-auto flex items-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </Button>

              {/* Tabs com informações detalhadas */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
                  <TabsTrigger value="technical" className="flex-1">Especificações</TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <div className="prose prose-neutral max-w-none">
                    {product.full_description}
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-4">
                  {product.technical_details && (
                    <div className="space-y-4">
                      {Object.entries(product.technical_details).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <dt className="font-medium text-neutral-900">{key}</dt>
                          <dd className="text-neutral-600">{value as string}</dd>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  {product.documents && (
                    <div className="space-y-4">
                      {Object.entries(product.documents).map(([name, url]) => (
                        <a
                          key={name}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <FileText className="w-5 h-5" />
                          {name}
                        </a>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Vídeo do produto, se disponível */}
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
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;