
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    short_description: string;
    main_image: string;
    default_image_url: string;
    gallery?: string[];
    price?: number;
    stock?: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const session = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine main_image and gallery for the carousel
  const images = (product.main_image || product.default_image_url)
    ? [product.main_image || product.default_image_url, ...(product.gallery || [])]
    : [];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
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
          {product.stock !== undefined && product.stock <= 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">
                Indisponível
              </Badge>
            </div>
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
        {product.stock !== undefined && product.stock > 0 && (
          <p className="text-sm mb-4">
            {product.stock} unidades em estoque
          </p>
        )}
        <Link to={`/products/${product.slug}`}>
          <Button variant="secondary" className="w-full group">
            Ver Detalhes
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
