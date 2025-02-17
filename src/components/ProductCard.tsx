
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@supabase/auth-helpers-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const session = useSession();
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine main_image and gallery for the carousel
  const images = (product.main_image || product.default_image_url)
    ? [product.main_image || product.default_image_url, ...(product.gallery || [])]
    : [];

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || product.default_image_url || "",
    };
    
    addItem(cartItem);
    toast.success(`${product.name} adicionado ao carrinho`);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-[4/3] relative overflow-hidden group">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  previousImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          {product.stock && product.stock < 5 && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-red-100 text-red-800"
            >
              Últimas unidades
            </Badge>
          )}
        </div>
      </Link>
      <div className="p-6 bg-primary text-white">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-white/90 mb-4 line-clamp-2">
          {product.short_description}
        </p>
        {session && product.price && (
          <p className="text-lg font-bold mb-4">
            R$ {product.price.toFixed(2)}
          </p>
        )}
        <div className="flex gap-2">
          <Link to={`/products/${product.slug}`} className="flex-1">
            <Button variant="secondary" className="w-full group">
              Ver Detalhes
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          {session && product.stock && product.stock > 0 && (
            <Button
              variant="secondary"
              onClick={handleAddToCart}
              className="flex-none"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
