
import { Card, CardContent } from "@/components/ui/card";
import { ProductsList } from "../../order/ProductsList";

interface ProductSelectionCardProps {
  products: any[];
  selectedProducts: any[];
  isLoading: boolean;
  onProductQuantityChange: (product: any, quantity: number) => void;
}

const ProductSelectionCard = ({
  products,
  selectedProducts,
  isLoading,
  onProductQuantityChange
}: ProductSelectionCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Produtos</h3>
        
        <div className="space-y-4">
          <ProductsList
            products={products}
            selectedProducts={selectedProducts}
            isLoading={isLoading}
            onProductQuantityChange={onProductQuantityChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelectionCard;
