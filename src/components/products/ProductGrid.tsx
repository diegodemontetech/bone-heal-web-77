
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { sortProductsByBrand } from "@/utils/product-formatters";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  // Sort products - Bone Heal first, then Heal Bone
  const sortedProducts = sortProductsByBrand(products);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
