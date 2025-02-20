
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

interface ProductsListProps {
  products: Product[];
  selectedProducts: Product[];
  isLoading: boolean;
  onProductQuantityChange: (product: Product, quantity: number) => void;
}

export const ProductsList = ({
  products,
  selectedProducts,
  isLoading,
  onProductQuantityChange,
}: ProductsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <Input
            type="number"
            min="0"
            className="w-20"
            value={
              selectedProducts.find((p) => p.id === product.id)?.quantity || 0
            }
            onChange={(e) => {
              const quantity = parseInt(e.target.value);
              onProductQuantityChange(product, quantity);
            }}
          />
        </div>
      ))}
    </div>
  );
};
