import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { cartItems, addToCart } = useCart();
  const [products, setProducts] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Produto adicionado ao carrinho", {
      duration: 1500 // Reduced from default to 1.5 seconds
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 bg-primary text-white py-2 px-4 rounded"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
