import { create } from "zustand";
import { Json } from "@/integrations/supabase/types";

export interface CartItem {
  [key: string]: string | number; // This makes CartItem compatible with Json type
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartStore {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  addToCart: (product: { id: string; name: string; price: number; image: string }) => void;
}

export const useCart = create<CartStore>((set) => ({
  cartItems: [],
  setCartItems: (items) => set((state) => ({
    cartItems: typeof items === "function" ? items(state.cartItems) : items,
  })),
  addToCart: (product) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return {
      cartItems: [...state.cartItems, { ...product, quantity: 1 }]
    };
  }),
}));