
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "./useSubcategoryForm";

interface CustomFieldsProps {
  form: UseFormReturn<FormFields>;
}

export const CustomFieldsList = ({ form }: CustomFieldsProps) => {
  // Implementação dos campos customizados
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Campos Customizados</h3>
      <p className="text-sm text-muted-foreground">
        Implementação dos campos customizados.
      </p>
    </div>
  );
};
