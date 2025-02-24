
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import ProductReviews from "./ProductReviews";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="description" className="space-y-6">
      <TabsList className="w-full justify-start h-auto bg-transparent p-0 flex flex-wrap gap-2">
        <TabsTrigger 
          value="description"
          className="bg-gray-50 hover:bg-gray-100 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-full px-6 py-2 transition-colors"
        >
          Descrição
        </TabsTrigger>
        <TabsTrigger 
          value="details"
          className="bg-gray-50 hover:bg-gray-100 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-full px-6 py-2 transition-colors"
        >
          Detalhes Técnicos
        </TabsTrigger>
        <TabsTrigger 
          value="reviews"
          className="bg-gray-50 hover:bg-gray-100 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-full px-6 py-2 transition-colors"
        >
          Avaliações
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="text-gray-600 leading-relaxed mt-6">
        {product.full_description || product.description || "Nenhuma descrição disponível."}
      </TabsContent>
      
      <TabsContent value="details" className="mt-6">
        {product.technical_details ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Característica</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(product.technical_details).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{value as string}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">Nenhum detalhe técnico disponível.</p>
        )}
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <ProductReviews product={product} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
