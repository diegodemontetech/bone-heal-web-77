
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductSubcategory } from "@/types/product";

interface SubcategoryFormHeaderProps {
  subcategory: ProductSubcategory | null | undefined;
}

export function SubcategoryFormHeader({ subcategory }: SubcategoryFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>{subcategory ? "Editar Subcategoria" : "Nova Subcategoria"}</DialogTitle>
      <DialogDescription>
        {subcategory ? "Edite os campos da subcategoria." : "Adicione uma nova subcategoria."}
      </DialogDescription>
    </DialogHeader>
  );
}
