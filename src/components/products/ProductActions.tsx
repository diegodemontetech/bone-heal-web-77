
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

interface ProductActionsProps {
  product: Product;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  
  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => {
        setAdded(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [added]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "/placeholder.svg",
      quantity: 1
    });
    
    setAdded(true);
    toast.success("Produto adicionado ao carrinho!");
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || "/placeholder.svg",
      quantity: 1
    });
    
    navigate("/cart");
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        variant="outline"
        className="w-1/2 text-xs border-green-600 text-green-700 hover:bg-green-50 uppercase"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="w-3 h-3 mr-1" />
        {added ? "ADICIONADO" : "CARRINHO"}
      </Button>
      
      <Button
        size="sm"
        className="w-1/2 text-xs bg-green-600 hover:bg-green-700 text-white font-semibold uppercase"
        onClick={handleBuyNow}
      >
        <CreditCard className="w-3 h-3 mr-1" />
        COMPRAR
      </Button>
    </div>
  );
};
