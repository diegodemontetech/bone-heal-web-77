
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ShoppingCart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionsProps {
  product: Product;
  profile: any | null;
}

const FloatingActions = ({ product, profile }: FloatingActionsProps) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show floating buttons when user scrolls past the main action buttons
      const actionsElement = document.getElementById('product-actions');
      if (actionsElement) {
        const actionsPosition = actionsElement.getBoundingClientRect();
        if (actionsPosition.bottom < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "/placeholder.svg",
      quantity: 1
    });

    toast.success("Produto adicionado ao carrinho!");
  };

  const handleSalesContact = () => {
    window.open(
      `https://wa.me/5511945122884?text=${encodeURIComponent(`Olá! Estou interessado no produto ${product.name}. Gostaria de mais informações.`)}`,
      '_blank'
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4"
        >
          <div className="flex gap-2 bg-black rounded-full shadow-lg p-2">
            {profile ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex-shrink-0"
                  onClick={() => navigate("/products")}
                >
                  <Home className="w-5 h-5" />
                </Button>
                
                <Button
                  size="icon"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex-shrink-0"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                size="icon"
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex-shrink-0"
                onClick={() => navigate("/login")}
              >
                <Home className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex-shrink-0"
              onClick={handleSalesContact}
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingActions;
