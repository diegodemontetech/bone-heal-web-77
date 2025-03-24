
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Product } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const [isOnOrder, setIsOnOrder] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        {product.omie_code && (
          <Badge variant="outline" className="font-normal">
            Código: {product.omie_code}
          </Badge>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sob Encomenda:</span>
          <Switch 
            checked={isOnOrder} 
            onCheckedChange={setIsOnOrder} 
          />
        </div>
      </div>
      
      {product.short_description && (
        <p className="text-gray-600">{product.short_description}</p>
      )}
      
      <div className="pt-2">
        <div className="text-3xl font-bold text-primary">
          {product.price ? formatCurrency(product.price) : "Consulte"}
        </div>
        
        {isOnOrder ? (
          <div className="mt-2 text-sm text-orange-600 font-medium">
            Prazo de entrega: 5-7 dias úteis após confirmação do pagamento
          </div>
        ) : (
          <div className="mt-2 text-sm text-green-600 font-medium">
            Pronta entrega - Consulte nosso time de vendas
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;
