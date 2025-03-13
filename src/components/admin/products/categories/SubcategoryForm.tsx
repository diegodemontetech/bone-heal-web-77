
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useSubcategoryForm } from "./subcategory/useSubcategoryForm";
import { SubcategoryFormHeader } from "./subcategory/SubcategoryFormHeader";
import { CustomFieldsList } from "./subcategory/CustomFieldsList";

export interface SubcategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  category: any;
  subcategory?: any;
}

export const SubcategoryForm = ({
  isOpen,
  onClose,
  onSuccess,
  category,
  subcategory
}: SubcategoryFormProps) => {
  const isEdit = !!subcategory;
  const categoryId = category?.id;
  
  const {
    form,
    isSubmitting,
    onSubmit
  } = useSubcategoryForm({
    categoryId,
    subcategoryId: subcategory?.id,
    initialData: subcategory,
    onSuccess
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <SubcategoryFormHeader
          title="Subcategoria"
          isEdit={isEdit}
        />
        
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da subcategoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição da subcategoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CustomFieldsList form={form} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Atualizando..." : "Criando..."}
                  </>
                ) : (
                  isEdit ? "Atualizar" : "Criar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
