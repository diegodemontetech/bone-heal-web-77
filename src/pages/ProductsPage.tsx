
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PageLoader from "@/components/PageLoader";
import { Product } from "@/types/product";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchTerm, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("active", true);
      
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }
      
      if (categoryFilter) {
        query = query.eq("category_id", categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
      
      return data as Product[];
    },
  });
  
  const categories = [
    { id: null, name: "Todos" },
    { id: "membranas", name: "Membranas" },
    { id: "enxertos", name: "Enxertos" },
    { id: "instrumentais", name: "Instrumentais" }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary">Produtos</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça nossa linha completa de produtos para regeneração óssea e tecidual
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id || "all"}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    onClick={() => setCategoryFilter(category.id)}
                    className={categoryFilter === category.id ? "bg-primary" : ""}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center my-12">
              <PageLoader />
            </div>
          ) : (
            <>
              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
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
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          {product.category && (
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">
                          {product.short_description || "Solução avançada para regeneração óssea"}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {product.dimensions && `Dimensões: ${product.dimensions}`}
                        </p>
                        <Button variant="link" className="group-hover:text-primary transition-colors p-0">
                          Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">Nenhum produto encontrado</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default ProductsPage;
