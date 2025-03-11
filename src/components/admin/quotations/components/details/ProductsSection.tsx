
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ProductItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  product_image?: string;
}

interface ProductsSectionProps {
  items: ProductItem[];
}

export const ProductsSection = ({ items }: ProductsSectionProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Produtos</h3>
      <Card>
        <CardContent className="p-4 space-y-4">
          {items?.map((item, index) => (
            <div key={index} className="flex space-x-3">
              {item.product_image && (
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border">
                  <img 
                    src={item.product_image} 
                    alt={item.product_name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(Number(item.unit_price || 0) * Number(item.quantity || 0))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
