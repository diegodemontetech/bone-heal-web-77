
import { RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/product";

interface ProductsTableProps {
  products: Product[] | null;
  isLoading: boolean;
  error: Error | null;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const ProductsTable = ({
  products,
  isLoading,
  error,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Código Omie</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Peso (kg)</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead>Status Omie</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-red-500">
                Erro ao carregar produtos. Por favor, tente novamente.
              </TableCell>
            </TableRow>
          ) : !products || products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Nenhum produto encontrado. Clique em "Novo Produto" para adicionar.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.omie_code || "Não sincronizado"}</TableCell>
                <TableCell>
                  {product.price
                    ? `R$ ${product.price.toFixed(2)}`
                    : "Não definido"}
                </TableCell>
                <TableCell>
                  {product.weight 
                    ? `${product.weight} kg`
                    : "0.5 kg"}
                </TableCell>
                <TableCell>
                  {product.omie_last_update 
                    ? new Date(product.omie_last_update).toLocaleString()
                    : "Nunca"}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.omie_sync 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {product.omie_sync ? "Sincronizado" : "Pendente"}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.active}
                    onCheckedChange={() => onToggleActive(product.id, product.active || false)}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
