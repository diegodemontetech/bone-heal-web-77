import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ShoppingCart, Minus, Plus, LogIn } from "lucide-react";
import { toast } from "sonner";
import CartWidget from "@/components/cart/CartWidget";
import { useAuth } from "@supabase/auth-helpers-react";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>>([]);
  const navigate = useNavigate();
  const session = useAuth();

  const handleAddToCart = () => {
    if (!session) {
      toast.error("Faça login para adicionar produtos ao carrinho");
      navigate("/login");
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      quantity: quantity,
      price: product.price || 0,
      image: product.main_image || "",
    };

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, newItem];
    });

    setIsCartOpen(true);
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
        {session ? (
          <>
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
          </>
        ) : (
          <Button
            size="lg"
            className="flex-1 text-white"
            onClick={() => navigate("/login")}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Entrar para Comprar
          </Button>
        )}
      </div>

      <CartWidget
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
      />
    </motion.div>
  );
};

export default ProductInfo;