
import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/cart';

export type { CartItem };

export interface CartStore {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
  cartItems: CartItem[]; // Alias para cart para compatibilidade
  total: number; // Alias para getTotalPrice para compatibilidade
  clear: () => void; // Alias para clearCart para compatibilidade
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
    // Garantir que item tenha uma quantidade definida
    const newItem = {
      ...item,
      quantity: item.quantity || 1
    };
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === newItem.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === newItem.id ? { ...cartItem, quantity: cartItem.quantity + newItem.quantity } : cartItem
        );
      } else {
        return [...prevCart, newItem];
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
    isLoading,
    // Aliases para compatibilidade
    cartItems: cart,
    total: getTotalPrice(),
    clear: clearCart
  };
};

export const useCart = useCartStore;
