import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ShoppingCart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Cart functionality will be implemented later
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
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

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Button
          size="lg"
          className="flex-1 text-white"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductInfo;