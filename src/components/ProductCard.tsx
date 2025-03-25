
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { useProductImage } from "@/hooks/use-product-image";
import { ProductPricing } from "@/components/products/ProductPricing";
import { ProductActions } from "@/components/products/ProductActions";
import { formatProductName, generateCleanSlug } from "@/utils/product-formatters";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { getProductImageUrl } = useProductImage();
  
  // Ensure product has a valid name
  const productName = product.name || "Produto sem nome";
  
  // Generate a clean slug for the URL
  const productSlug = generateCleanSlug(productName, product.slug);
  const productUrl = `/products/${encodeURIComponent(productSlug)}`;

  // Get product image URL
  const productImage = getProductImageUrl(product.main_image, product.default_image_url);
  
  // Fallback image if none is available
  const fallbackImage = "/placeholder.svg";

  return (
    <Card className="relative group h-full">
      <FavoriteButton product={product} variant="icon" />
      <Link to={productUrl} className="flex flex-col h-full">
        <CardContent className="pt-4 flex-shrink-0">
          <div className="aspect-square relative bg-foreground/5 dark:bg-background rounded-lg overflow-hidden">
            <img
              src={productImage}
              alt={productName}
              className="aspect-square object-cover rounded-lg transition-all duration-300 group-hover:scale-105 w-full h-full"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", productImage);
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start flex-grow">
          <div className="w-full">
            <h3 className="font-semibold text-md md:text-lg line-clamp-2">
              {formatProductName(productName)}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {product.short_description || "Sem descrição"}
            </p>
            
            <ProductPricing price={product.price || 0} />
            
            <ProductActions product={product} />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
