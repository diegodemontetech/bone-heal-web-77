
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

  // Garantir que o slug é válido e criar URL absoluta
  const productUrl = `/products/${product.slug || ''}`;

  return (
    <Card className="relative group">
      <FavoriteButton product={product} variant="icon" />
      <Link to={productUrl}>
        <CardContent className="pt-4">
          <div className="aspect-square relative bg-foreground/5 dark:bg-background rounded-lg">
            <img
              src={product.main_image || product.default_image_url}
              alt={product.name}
              className="aspect-square object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <div className="w-full">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.short_description}
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
