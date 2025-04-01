
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

  // Localized field names mapping
  const fieldNameMapping: Record<string, string> = {
    'weight': 'Peso',
    'height': 'Altura',
    'width': 'Largura',
    'length': 'Comprimento',
    'material': 'Material',
    'composition': 'Composição',
    'indication': 'Indicação',
    'contraindication': 'Contraindicação',
    'instructions': 'Instruções de uso',
    'registration': 'Registro ANVISA',
    'classification': 'Classificação',
    'dimensions': 'Dimensões',
    'materials': 'Materiais',
    'usage': 'Uso',
    'regulatory': 'Regulatório'
  };

  // Translate key names
  const translateKey = (key: string): string => {
    const parts = key.split(' - ');
    if (parts.length === 2) {
      const category = fieldNameMapping[parts[0]] || parts[0];
      const attribute = fieldNameMapping[parts[1]] || parts[1];
      return `${category} - ${attribute}`;
    }
    return fieldNameMapping[key] || key;
  };

  const flattenedDetails: Record<string, any> = {};
  
  // Flatten the nested structure for display
  Object.entries(product.technical_details).forEach(([category, details]) => {
    if (typeof details === 'object' && details !== null) {
      Object.entries(details).forEach(([key, value]) => {
        const displayKey = `${fieldNameMapping[category] || category} - ${fieldNameMapping[key] || key}`;
        
        // Remove Omie code from registration if present
        if (key === 'registration' && typeof value === 'string') {
          value = value.replace(/\(Código Omie: .*\)/g, '').trim();
        }
        
        flattenedDetails[displayKey] = value;
      });
    } else {
      flattenedDetails[fieldNameMapping[category] || category] = details;
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
              <TableHead className="w-1/3">Atributos</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(flattenedDetails).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{translateKey(key)}</TableCell>
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
