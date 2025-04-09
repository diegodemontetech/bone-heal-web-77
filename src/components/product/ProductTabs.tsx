import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatProductName } from "@/utils/product-formatters";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const isMobile = useIsMobile();

  // This component has been refactored and is no longer used with tabs
  // Keeping it for backwards compatibility
  return (
    <div className="space-y-6">
      <div className="text-gray-600 leading-relaxed">
        {product.full_description || product.description || "Nenhuma descrição disponível."}
      </div>
    </div>
  );
};

export default ProductTabs;
