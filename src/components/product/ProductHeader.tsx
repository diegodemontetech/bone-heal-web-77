
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { Star } from "lucide-react";

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
      brandName = "Bone Heal®";
    } else if (cleanName.includes("Heal Bone")) {
      brandName = "Heal Bone®";
    }
    
    // If brand found, create new product name with brand first
    if (brandName) {
      const productNameWithoutBrand = cleanName.replace(/Bone Heal®?|Heal Bone®?/g, "").trim();
      return `${brandName} ${productNameWithoutBrand}`;
    }
    
    return cleanName;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{formatProductName(product.name)}</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-normal bg-primary/10">
          Registro ANVISA: 81197590000
        </Badge>
        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span>5.0</span>
            <span className="ml-1 text-xs text-green-600">(90+ avaliações)</span>
          </div>
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
