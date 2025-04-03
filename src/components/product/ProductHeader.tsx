
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Product } from "@/types/product";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  // Format product name to show brand first and remove unwanted parentheses
  const formatProductName = (name: string) => {
    // Remove unwanted parentheses
    let cleanName = name.replace(/\(\)|\(\s*\)/g, '').trim();
    
    // Check if the name already starts with a brand name
    if (cleanName.startsWith("Bone Heal") || cleanName.startsWith("Heal Bone")) {
      return cleanName;
    }
    
    // Extract brand name
    let brandName = "";
    if (cleanName.includes("Bone Heal")) {
      brandName = "Bone Heal";
    } else if (cleanName.includes("Heal Bone")) {
      brandName = "Heal Bone";
    }
    
    // If brand found, create new product name with brand first
    if (brandName) {
      const productNameWithoutBrand = cleanName.replace(brandName, "").trim();
      return `${brandName} ${productNameWithoutBrand}`;
    }
    
    return cleanName;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{formatProductName(product.name)}</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        {product.omie_code && (
          <Badge variant="outline" className="font-normal">
            Código: {product.omie_code}
          </Badge>
        )}
        <Badge variant="outline" className="font-normal bg-primary/10">
          Registro ANVISA: 81197590000
        </Badge>
      </div>
      
      {product.short_description && (
        <p className="text-gray-600">{product.short_description}</p>
      )}
      
      <div className="pt-2">
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
