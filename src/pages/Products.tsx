
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true);
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Product[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Produtos</h1>
          <p className="text-gray-600 max-w-2xl">
            Conheça nossa linha completa de produtos de alta qualidade.
          </p>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-3"></div>
                <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            
            {products?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500">
                  Não encontramos produtos com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Products;
