
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/FavoriteButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Format price using Intl API
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price || 0);

  // Use the product slug for routing
  const productUrl = product.slug ? `/products/${encodeURIComponent(product.slug)}` : "/products";

  // Log warning if no slug is present
  if (!product.slug) {
    console.warn('Produto sem slug:', product);
  }

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
              loading="lazy" // Add lazy loading for better performance
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
