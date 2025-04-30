
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadsterChat from "@/components/LeadsterChat";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { sortProductsByBrand } from "@/utils/product-formatters";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => {
      console.log("Buscando produtos com termo:", searchTerm);
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true);
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Erro ao buscar produtos:", error);
        throw new Error(error.message);
      }
      
      console.log("Produtos encontrados:", data);
      return data as Product[];
    },
  });

  // Sort products - Bone Heal first, then Heal Bone
  const sortedProducts = products ? sortProductsByBrand(products) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Produtos | BoneHeal</title>
        <meta name="description" content="Conheça a linha completa de produtos BoneHeal para regeneração óssea guiada na Odontologia." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Produtos</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Dispositivos médicos implantáveis de polipropileno para Regeneração Óssea Guiada na Odontologia.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <div className="relative mb-8">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden bg-gray-50 animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts && sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img 
                        src={product.main_image ? `https://kurpshcdafxbyqnzxvxu.supabase.co/storage/v1/object/public/products/${product.main_image}` : product.default_image_url || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{product.short_description || product.description}</p>
                      {product.price && (
                        <p className="font-bold text-xl text-primary mb-4">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                      <Button asChild className="w-full">
                        <Link to={`/produtos/${product.slug || product.id}`}>Ver detalhes</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-gray-600">
                    Nenhum produto encontrado com os filtros aplicados.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
      <WhatsAppWidget />
      <LeadsterChat 
        title="Dúvidas sobre nossos produtos?"
        message="Olá! Posso ajudar você a escolher o produto BoneHeal ideal para o seu procedimento?"
      />
    </div>
  );
};

export default Produtos;
