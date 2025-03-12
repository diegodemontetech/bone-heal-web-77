
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductsList } from "../../order/ProductsList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  [key: string]: any;
}

interface ProductSelectionCardProps {
  products: Product[];
  selectedProducts: any[];
  isLoading: boolean;
  onProductQuantityChange: (product: any, quantity: number) => void;
}

/**
 * Componente para selecionar produtos em um orçamento
 */
const ProductSelectionCard = ({
  products,
  selectedProducts,
  isLoading,
  onProductQuantityChange
}: ProductSelectionCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Filtra os produtos quando o termo de busca ou a lista de produtos mudar
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(lowercaseSearch) || 
        product.id.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Produtos</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ProductsList
            products={filteredProducts}
            selectedProducts={selectedProducts}
            isLoading={isLoading}
            onProductQuantityChange={onProductQuantityChange}
          />
          
          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center p-4 text-muted-foreground">
              {searchTerm ? 
                "Nenhum produto encontrado com este termo." : 
                "Nenhum produto disponível."
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelectionCard;
