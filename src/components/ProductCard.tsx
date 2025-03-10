
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/FavoriteButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price || 0);

  // Verificar e garantir que o produto tenha um slug válido
  const slug = product.slug && product.slug.trim() !== "" 
    ? product.slug 
    : `produto-${product.id}`;
  
  // Garantir que o slug seja codificado corretamente para a URL
  const productUrl = `/products/${encodeURIComponent(slug)}`;

  // Garantir que a imagem tenha um fallback válido
  const fallbackImage = "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=1470&auto=format&fit=crop";
  const productImage = product.main_image || product.default_image_url || fallbackImage;

  return (
    <Card className="relative group h-full">
      <FavoriteButton product={product} variant="icon" />
      <Link to={productUrl} className="flex flex-col h-full">
        <CardContent className="pt-4 flex-shrink-0">
          <div className="aspect-square relative bg-foreground/5 dark:bg-background rounded-lg overflow-hidden">
            <img
              src={productImage}
              alt={product.name}
              className="aspect-square object-cover rounded-lg transition-all duration-300 group-hover:scale-105 w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start flex-grow">
          <div className="w-full">
            <h3 className="font-semibold text-lg line-clamp-2">{product.name || "Produto sem nome"}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.short_description || "Sem descrição"}
            </p>
            <div className="mt-2 font-semibold text-lg">
              {formattedPrice}
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
