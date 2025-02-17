
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
  items: CartItem[];
  total: number;
  setCartItems: (items: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  addItem: (product: Pick<CartItem, 'id' | 'name' | 'price' | 'image'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set, get) => ({
  cartItems: [],
  items: [],
  total: 0,
  setCartItems: (items) => set((state) => {
    const newItems = typeof items === "function" ? items(state.cartItems) : items;
    const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      cartItems: newItems,
      items: newItems,
      total
    };
  }),
  addItem: (product) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      const newItems = state.cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return {
        cartItems: newItems,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    }
    const newItems = [...state.cartItems, { ...product, quantity: 1 }];
    return {
      cartItems: newItems,
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }),
  updateQuantity: (productId, quantity) => set((state) => {
    const newItems = state.cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    );
    return {
      cartItems: newItems,
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }),
  removeItem: (productId) => set((state) => {
    const newItems = state.cartItems.filter(item => item.id !== productId);
    return {
      cartItems: newItems,
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }),
  clear: () => set({ cartItems: [], items: [], total: 0 }),
  clearCart: () => set({ cartItems: [], items: [], total: 0 }),
}));
