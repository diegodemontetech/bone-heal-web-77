
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductTechDetailsProps {
  product: Product;
}

const ProductTechDetails = ({ product }: ProductTechDetailsProps) => {
  if (!product.technical_details || Object.keys(product.technical_details).length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detalhes Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum detalhe técnico disponível para este produto.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Detalhes Técnicos</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ProductTechDetails;
