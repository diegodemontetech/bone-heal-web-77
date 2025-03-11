
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductsList } from "./ProductsList";

interface ProductSelectionProps {
  products: any[];
  isLoadingProducts: boolean;
  selectedProducts: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onProductQuantityChange: (product: any, quantity: number) => void;
}

export const ProductSelection = ({
  products,
  isLoadingProducts,
  selectedProducts,
  searchTerm,
  setSearchTerm,
  onProductQuantityChange
}: ProductSelectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Produtos</h3>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produto por nome..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <ProductsList
          products={products}
          selectedProducts={selectedProducts}
          isLoading={isLoadingProducts}
          onProductQuantityChange={onProductQuantityChange}
        />
      </div>
    </div>
  );
};
