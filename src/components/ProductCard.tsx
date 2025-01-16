import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    price?: number;
    stock?: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const session = useSession();
  
  // Placeholder image from Unsplash
  const placeholderImage = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={product.main_image ? `/products/${product.main_image}` : placeholderImage}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
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