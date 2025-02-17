
import { Heart, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

interface FavoriteButtonProps {
  product: Product;
  variant?: "icon" | "default";
}

export function FavoriteButton({ product, variant = "default" }: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const isProductFavorite = isFavorite(product.id);

  const handleToggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      toast({
        title: "Removido dos favoritos",
        description: `${product.name} foi removido da sua lista de desejos.`,
      });
    } else {
      addToFavorites(product);
      toast({
        title: "Adicionado aos favoritos",
        description: `${product.name} foi adicionado à sua lista de desejos.`,
      });
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
      >
        {isProductFavorite ? (
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        ) : (
          <Heart className="h-5 w-5" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={isProductFavorite ? "destructive" : "secondary"}
      onClick={handleToggleFavorite}
      className="w-full"
    >
      {isProductFavorite ? (
        <>
          <HeartOff className="mr-2 h-4 w-4" />
          Remover dos Favoritos
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          Adicionar aos Favoritos
        </>
      )}
    </Button>
  );
}
