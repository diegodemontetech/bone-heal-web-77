
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import ProductReviews from "./ProductReviews";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="description" className="space-y-4">
      <TabsList>
        <TabsTrigger value="description">Descrição</TabsTrigger>
        <TabsTrigger value="details">Detalhes Técnicos</TabsTrigger>
        <TabsTrigger value="reviews">Avaliações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="text-muted-foreground">
        {product.full_description || product.description || "Nenhuma descrição disponível."}
      </TabsContent>
      
      <TabsContent value="details">
        {product.technical_details ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Característica</TableHead>
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
          <p className="text-muted-foreground">Nenhum detalhe técnico disponível.</p>
        )}
      </TabsContent>

      <TabsContent value="reviews">
        <ProductReviews product={product} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
