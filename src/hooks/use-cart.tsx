
import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/cart';
import { toast } from 'sonner';

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

// Key for local storage
const CART_STORAGE_KEY = 'boneheal_cart';

const useCartStore = (): CartStore => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on initialization
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      console.log("[useCart] Carregando carrinho do localStorage:", storedCart);
      
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          console.log("[useCart] Carrinho carregado com sucesso, itens:", parsedCart.length);
          setCart(parsedCart);
        } else {
          console.error("[useCart] Stored cart is not an array:", parsedCart);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } else {
        console.log("[useCart] Nenhum carrinho encontrado no localStorage");
      }
    } catch (error) {
      console.error("[useCart] Error loading cart from storage:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      console.log("[useCart] Salvando carrinho no localStorage, itens:", cart.length);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const addItem = useCallback((item: CartItem) => {
    // Garantir que item tenha uma quantidade definida
    const newItem = {
      ...item,
      quantity: item.quantity || 1
    };
    
    console.log("[useCart] Adicionando item ao carrinho:", newItem);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === newItem.id);
      if (existingItem) {
        console.log("[useCart] Item já existe no carrinho, atualizando quantidade");
        return prevCart.map(cartItem =>
          cartItem.id === newItem.id ? { ...cartItem, quantity: cartItem.quantity + newItem.quantity } : cartItem
        );
      } else {
        console.log("[useCart] Novo item adicionado ao carrinho");
        return [...prevCart, newItem];
      }
    });
    
    toast.success("Produto adicionado ao carrinho");
  }, []);

  const removeItem = useCallback((id: string) => {
    console.log("[useCart] Removendo item do carrinho:", id);
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    console.log("[useCart] Atualizando quantidade:", id, quantity);
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    console.log("[useCart] Limpando carrinho");
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
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
