
import { create } from "zustand";
import { Json } from "@/integrations/supabase/types";

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartStore {
  cartItems: CartItem[];
  total: number;
  addItem: (product: Pick<CartItem, 'id' | 'name' | 'price' | 'image'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
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
      total
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
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }),
  removeItem: (productId) => set((state) => {
    const newItems = state.cartItems.filter(item => item.id !== productId);
    return {
      cartItems: newItems,
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }),
  clear: () => set({ cartItems: [], total: 0 }),
}));
