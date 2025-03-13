
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SubcategoryFormProps } from "./types";
import { SubcategoryFormHeader } from "./subcategory/SubcategoryFormHeader";
import { SubcategoryFormFields } from "./subcategory/SubcategoryFormFields";
import { CustomFieldsList } from "./subcategory/CustomFieldsList";
import { useSubcategoryForm } from "./subcategory/useSubcategoryForm";

export function SubcategoryForm({ open, onClose, onSuccess, category, subcategory }: SubcategoryFormProps) {
  const {
    form,
    loading,
    fields,
    handleAddField,
    handleFieldChange,
    onSubmit
  } = useSubcategoryForm(category, subcategory, onSuccess, onClose);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <SubcategoryFormHeader subcategory={subcategory} />
        
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SubcategoryFormFields form={form} />

            <CustomFieldsList 
              fields={fields}
              onFieldChange={handleFieldChange}
              onAddField={handleAddField}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
