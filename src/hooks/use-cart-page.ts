
import { useCart } from "./use-cart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCartPage = () => {
  const { 
    cart, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems 
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
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return {
    cart,
    isLoading,
    removeItem: handleRemoveItem,
    updateQuantity: handleQuantityChange,
    clearCart: handleClearCart,
    checkout: handleCheckout,
    getTotalPrice,
    getTotalItems
  };
};
