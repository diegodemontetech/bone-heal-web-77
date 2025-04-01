
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

const useCartStore = (): CartStore => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on initialization
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      console.log("Carregando carrinho do localStorage:", storedCart);
      
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          console.log("Carrinho carregado com sucesso, itens:", parsedCart.length);
          setCart(parsedCart);
        } else {
          console.error("Stored cart is not an array:", parsedCart);
          localStorage.removeItem('cart');
        }
      } else {
        console.log("Nenhum carrinho encontrado no localStorage");
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      localStorage.removeItem('cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      console.log("Salvando carrinho no localStorage, itens:", cart.length);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const addItem = useCallback((item: CartItem) => {
    // Garantir que item tenha uma quantidade definida
    const newItem = {
      ...item,
      quantity: item.quantity || 1
    };
    
    console.log("Adicionando item ao carrinho:", newItem);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === newItem.id);
      if (existingItem) {
        console.log("Item já existe no carrinho, atualizando quantidade");
        return prevCart.map(cartItem =>
          cartItem.id === newItem.id ? { ...cartItem, quantity: cartItem.quantity + newItem.quantity } : cartItem
        );
      } else {
        console.log("Novo item adicionado ao carrinho");
        return [...prevCart, newItem];
      }
    });
    
    toast.success("Produto adicionado ao carrinho");
  }, []);

  const removeItem = useCallback((id: string) => {
    console.log("Removendo item do carrinho:", id);
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    console.log("Atualizando quantidade:", id, quantity);
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    console.log("Limpando carrinho");
    setCart([]);
    localStorage.removeItem('cart');
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
