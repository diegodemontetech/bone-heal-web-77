
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface FavoritesStore {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addToFavorites: (product) => {
        const { favorites } = get();
        if (!favorites.find((p) => p.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },
      removeFromFavorites: (productId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((p) => p.id !== productId) });
      },
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.some((p) => p.id === productId);
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);
