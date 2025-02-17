
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface BrowseHistoryStore {
  history: Product[];
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
}

export const useBrowseHistory = create<BrowseHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (product) => {
        const { history } = get();
        const newHistory = [
          product,
          ...history.filter((p) => p.id !== product.id)
        ].slice(0, 20); // Mantém apenas os últimos 20 produtos
        set({ history: newHistory });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "browse-history-storage",
    }
  )
);
