
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price || 0);

  // Ensure product has a valid name
  const productName = product.name || "Produto sem nome";
  
  // Generate a clean slug for the URL
  const generateCleanSlug = (name: string) => {
    if (product.slug && product.slug.trim() !== "") {
      return product.slug;
    }
    
    // Create a clean slug from the name
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-")     // Replace spaces with hyphens
      .replace(/-+/g, "-")      // Remove consecutive hyphens
      .trim();
  };
  
  const productSlug = generateCleanSlug(productName);
  const productUrl = `/products/${encodeURIComponent(productSlug)}`;

  // Fallback image if none is available
  const fallbackImage = "/placeholder.svg";
  
  // Get public URL for product image
  const getProductImageUrl = () => {
    if (!product.main_image) {
      return product.default_image_url || fallbackImage;
    }
    
    if (product.main_image.startsWith('http')) {
      return product.main_image;
    }
    
    try {
      // Extract the filename if it's a full path
      const pathParts = product.main_image.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
      
      console.log(`Generated URL for ${product.main_image}: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao obter URL da imagem:", error);
      return fallbackImage;
    }
  };

  const productImage = getProductImageUrl();

  // Format product name to show brand first
  const formatProductName = (name: string) => {
    // Check if the name contains "Bone Heal" or "Heal Bone" anywhere
    if (name.includes("Bone Heal") || name.includes("Heal Bone")) {
      // If it already starts with a brand name, return as is
      if (name.startsWith("Bone Heal") || name.startsWith("Heal Bone")) {
        return name;
      }
      
      // Extract brand name
      let brandName = "";
      if (name.includes("Bone Heal")) {
        brandName = "Bone Heal";
      } else if (name.includes("Heal Bone")) {
        brandName = "Heal Bone";
      }
      
      // Create new product name with brand first
      const productNameWithoutBrand = name.replace(brandName, "").trim();
      return `${brandName} ${productNameWithoutBrand}`;
    }
    
    return name;
  };

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
            <h3 className="font-semibold text-lg line-clamp-2">
              {formatProductName(productName)}
            </h3>
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
