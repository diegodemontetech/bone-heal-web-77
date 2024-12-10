import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    main_image: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={`/products/${product.main_image}`}
          alt={product.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-2">
          {product.short_description}
        </p>
        <Link to={`/products/${product.slug}`}>
          <Button className="w-full group">
            Ver Detalhes
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;