
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTargetingSectionProps {
  productId: string | null;
  productCategory: string | null;
  onProductIdChange: (value: string) => void;
  onProductCategoryChange: (value: string) => void;
}

const ProductTargetingSection = ({
  productId,
  productCategory,
  onProductIdChange,
  onProductCategoryChange
}: ProductTargetingSectionProps) => {
  // Opções de categorias de produtos
  const categoryOptions = [
    { value: "", label: "Todas as categorias" },
    { value: "supplements", label: "Suplementos" },
    { value: "equipment", label: "Equipamentos" },
    { value: "accessories", label: "Acessórios" },
    { value: "disposables", label: "Descartáveis" }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Segmentação por Produto</h3>
      
      <div className="space-y-2">
        <Label htmlFor="product_id">ID do Produto Específico (opcional)</Label>
        <Input
          id="product_id"
          placeholder="Ex: 123e4567-e89b-12d3-a456-426614174000"
          value={productId || ""}
          onChange={(e) => onProductIdChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Deixe em branco para aplicar a todos os produtos
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="product_category">Categoria de Produto</Label>
        <Select
          value={productCategory || ""}
          onValueChange={onProductCategoryChange}
        >
          <SelectTrigger id="product_category">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductTargetingSection;
