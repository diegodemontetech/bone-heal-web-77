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
}

export const useCart = create<CartStore>((set) => ({
  cartItems: [],
  setCartItems: (items) => set((state) => ({
    cartItems: typeof items === "function" ? items(state.cartItems) : items,
  })),
}));