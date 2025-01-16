import { create } from "zustand";

interface CartItem {
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