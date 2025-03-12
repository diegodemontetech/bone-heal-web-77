import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/cart';

export interface CartStore {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
}

const useCartStore = (): CartStore => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
        );
      } else {
        return [...prevCart, item];
      }
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading
  };
};

export const useCart = useCartStore;
