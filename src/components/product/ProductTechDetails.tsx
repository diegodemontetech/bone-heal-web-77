
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

  // Helper function to render values properly
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return "-";
    }
    
    if (typeof value === "object") {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="border-b pb-1 last:border-0">
              <span className="font-medium">{subKey}: </span>
              {typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}
            </div>
          ))}
        </div>
      );
    }
    
    return String(value);
  };

  const flattenedDetails: Record<string, any> = {};
  
  // Flatten the nested structure for display
  Object.entries(product.technical_details).forEach(([category, details]) => {
    if (typeof details === 'object' && details !== null) {
      Object.entries(details).forEach(([key, value]) => {
        const displayKey = `${category} - ${key}`;
        flattenedDetails[displayKey] = value;
      });
    } else {
      flattenedDetails[category] = details;
    }
  });

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
            {Object.entries(flattenedDetails).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{renderValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductTechDetails;
