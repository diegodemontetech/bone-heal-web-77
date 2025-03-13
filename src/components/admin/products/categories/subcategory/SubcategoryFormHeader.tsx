
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SubcategoryFormHeaderProps {
  title: string;
  isEdit?: boolean;
}

export const SubcategoryFormHeader = ({ title, isEdit = false }: SubcategoryFormHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>{isEdit ? `Editar ${title}` : `Nova ${title}`}</DialogTitle>
    </DialogHeader>
  );
};
