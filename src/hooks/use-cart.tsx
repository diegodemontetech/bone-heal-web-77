
import { create } from "zustand";
import { Json } from "@/integrations/supabase/types";

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  weight?: number; // Adicionando a propriedade weight como opcional
}

interface CartStore {
  cartItems: CartItem[];
  total: number;
  addItem: (product: Pick<CartItem, 'id' | 'name' | 'price' | 'image'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  // Adicionando os métodos ausentes
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  cart?: CartItem[]; // Para compatibilidade com componentes existentes
}

export const useCart = create<CartStore>((set, get) => ({
  cartItems: [],
  total: 0,
  addItem: (product) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    let newItems;
    
    if (existingItem) {
      newItems = state.cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...state.cartItems, { ...product, quantity: 1 }];
    }

    const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    return {
      cartItems: newItems,
      total,
      cart: newItems // Adicionando para compatibilidade
    };
  }),
  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity < 1) return state;
    
    const newItems = state.cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    );
    
    return {
      cartItems: newItems,
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      cart: newItems // Adicionando para compatibilidade
    };
  }),
  removeItem: (productId) => set((state) => {
    const newItems = state.cartItems.filter(item => item.id !== productId);
    return {
      cartItems: newItems,
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      cart: newItems // Adicionando para compatibilidade
    };
  }),
  clear: () => set({ cartItems: [], total: 0, cart: [] }),
  
  // Implementando os métodos adicionais
  clearCart: () => set({ cartItems: [], total: 0, cart: [] }),
  
  getTotalPrice: () => {
    return get().total;
  },
  
  getTotalItems: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
