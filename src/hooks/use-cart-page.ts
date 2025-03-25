
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
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // Check if cart is empty before navigating
    if (cartItems && cartItems.length > 0) {
      navigate("/checkout");
    } else {
      navigate("/products");
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
    getTotalItems
  };
};
