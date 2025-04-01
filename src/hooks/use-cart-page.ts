
import { useCart } from "./use-cart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCartPage = () => {
  const { 
    cart, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
    cartItems
  } = useCart();
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success("Item removido do carrinho");
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Carrinho esvaziado");
  };

  const handleCheckout = () => {
    console.log("Tentando prosseguir para checkout, itens:", cartItems?.length);
    
    // Check if cart is empty before navigating
    if (cartItems && cartItems.length > 0) {
      setIsLoading(true);
      // Pequeno atraso para garantir que a navegação funcione corretamente
      setTimeout(() => {
        navigate("/checkout");
        setIsLoading(false);
      }, 100);
    } else {
      toast.error("Adicione itens ao carrinho para continuar");
      setTimeout(() => {
        navigate("/products");
      }, 500);
    }
  };

  return {
    cart,
    isLoading,
    removeItem: handleRemoveItem,
    updateQuantity: handleQuantityChange,
    clearCart: handleClearCart,
    checkout: handleCheckout,
    getTotalPrice,
    getTotalItems,
    cartItems
  };
};
