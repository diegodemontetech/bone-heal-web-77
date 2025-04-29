import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Sparkles, FileCheck, MessageCircle, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import PageLoader from "@/components/PageLoader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Product } from "@/types/product";

const HomePage = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .limit(6);

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }

      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/20 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary">
                  Regeneração Óssea Revolucionária
                </h1>
                <p className="text-xl mb-8 text-gray-700 max-w-lg">
                  Soluções avançadas para regeneração óssea e tecidual, desenvolvidas com tecnologia de ponta para profissionais da odontologia.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/produtos">
                    <Button className="bg-primary text-white text-lg px-8 py-6">
                      Nossos Produtos
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/como-funciona">
                    <Button variant="outline" className="text-lg px-8 py-6">
                      Como Funciona
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/hero-image.jpg"
                  alt="Regeneração Óssea"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Produtos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Conheça nossa linha completa de produtos para regeneração óssea e tecidual
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center my-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts?.map((product: Product) => (
                  <Link 
                    key={product.id} 
                    to={`/produtos/${product.id}`}
                    className="group hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg overflow-hidden border border-gray-200"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={product.image_url || product.main_image || product.default_image_url || "/product-placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.short_description || "Solução avançada para regeneração óssea"}
                      </p>
                      <Button variant="link" className="group-hover:text-primary transition-colors p-0">
                        Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/produtos">
                <Button className="bg-primary text-white">
                  Ver todos os produtos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefícios Exclusivos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubra por que profissionais em todo o Brasil escolhem os produtos Bone Heal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança</h3>
                <p className="text-gray-600">
                  Produtos certificados e aprovados pelos principais órgãos reguladores
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Inovação</h3>
                <p className="text-gray-600">
                  Tecnologia de ponta para resultados superiores em regeneração óssea
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
                <p className="text-gray-600">
                  Materiais premium e processos de fabricação rigorosos
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FileCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Resultados</h3>
                <p className="text-gray-600">
                  Comprovação científica e casos clínicos de sucesso
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Quer saber mais sobre nossos produtos?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Entre em contato com nossa equipe de especialistas e descubra como podemos ajudar sua prática clínica
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contato">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Entre em Contato
                </Button>
              </Link>
              <WhatsAppButton text="Olá, gostaria de mais informações sobre os produtos Bone Heal" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default HomePage;
