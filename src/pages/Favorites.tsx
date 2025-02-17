
import { useFavorites } from "@/hooks/use-favorites";
import { ProductGrid } from "@/components/products/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Minha Lista de Desejos</h1>
          <p className="text-muted-foreground mt-2">
            Produtos que você salvou para comprar depois
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Sua lista de desejos está vazia
            </h2>
            <p className="text-muted-foreground max-w-md">
              Adicione produtos à sua lista de desejos clicando no coração em qualquer produto do catálogo
            </p>
          </div>
        ) : (
          <ProductGrid products={favorites} />
        )}
      </main>

      <Footer />
    </div>
  );
}
