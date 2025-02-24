
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import ProductReviews from "./ProductReviews";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="description" className="space-y-6">
      <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 space-x-8">
        <TabsTrigger 
          value="description"
          className="data-[state=active]:border-violet-600 border-b-2 border-transparent rounded-none h-12 px-2"
        >
          Descrição
        </TabsTrigger>
        <TabsTrigger 
          value="details"
          className="data-[state=active]:border-violet-600 border-b-2 border-transparent rounded-none h-12 px-2"
        >
          Detalhes Técnicos
        </TabsTrigger>
        <TabsTrigger 
          value="reviews"
          className="data-[state=active]:border-violet-600 border-b-2 border-transparent rounded-none h-12 px-2"
        >
          Avaliações
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="text-gray-600 leading-relaxed">
        {product.full_description || product.description || "Nenhuma descrição disponível."}
      </TabsContent>
      
      <TabsContent value="details">
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

      <TabsContent value="reviews">
        <ProductReviews product={product} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
