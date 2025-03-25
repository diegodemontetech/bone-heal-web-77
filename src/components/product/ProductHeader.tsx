
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Product } from "@/types/product";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  // Format product name to show brand first
  const formatProductName = (name: string) => {
    // Check if the name already starts with a brand name
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
    
    // If brand found, create new product name with brand first
    if (brandName) {
      const productNameWithoutBrand = name.replace(brandName, "").trim();
      return `${brandName} ${productNameWithoutBrand}`;
    }
    
    return name;
  };
  
  // Function to safely format the price regardless of source
  const formatProductPrice = (price: number | string | null | undefined) => {
    // Handle various price formats that might come from Omie
    if (price === null || price === undefined) return "Consulte";
    
    // If price is a string that can be converted to a number
    if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice)) {
        return formatCurrency(numPrice);
      }
      return price; // If it's a non-numeric string, return as is
    }
    
    // If price is a number
    if (typeof price === 'number') {
      return formatCurrency(price);
    }
    
    return "Consulte";
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{formatProductName(product.name)}</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        {product.omie_code && (
          <Badge variant="outline" className="font-normal">
            Código: {product.omie_code}
          </Badge>
        )}
      </div>
      
      {product.short_description && (
        <p className="text-gray-600">{product.short_description}</p>
      )}
      
      <div className="pt-2">
        <div className="text-3xl font-bold text-primary">
          {formatProductPrice(product.price)}
        </div>
        
        {product.on_order ? (
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
