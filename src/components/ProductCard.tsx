
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

  // Verificar e garantir que o produto tenha um slug válido
  const slug = product.slug && product.slug.trim() !== "" 
    ? product.slug 
    : `produto-${product.id}`;
  
  // Garantir que o slug seja codificado corretamente para a URL
  const productUrl = `/products/${encodeURIComponent(slug)}`;

  // Garantir que a imagem tenha um fallback válido
  const fallbackImage = "/placeholder.svg";
  
  // Obter URL pública da imagem do produto
  const getProductImageUrl = () => {
    if (!product.main_image) {
      return product.default_image_url || fallbackImage;
    }
    
    if (product.main_image.startsWith('http')) {
      return product.main_image;
    }
    
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(product.main_image);
    
    return data.publicUrl;
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
              alt={product.name}
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
              {formatProductName(product.name || "Produto sem nome")}
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
