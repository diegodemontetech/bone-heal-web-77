
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useSubcategoryForm } from "./subcategory/useSubcategoryForm";
import { SubcategoryFormHeader } from "./subcategory/SubcategoryFormHeader";
import { SubcategoryFormFields } from "./subcategory/SubcategoryFormFields";
import { CustomFieldsList } from "./subcategory/CustomFieldsList";
import { FormFields } from "./subcategory/useSubcategoryForm";

interface SubcategoryFormProps {
  categoryId: string;
  subcategoryId?: string;
  onSuccess?: () => void;
}

export function SubcategoryForm({ categoryId, subcategoryId, onSuccess }: SubcategoryFormProps) {
  const { form, isSubmitting, handleFormSubmit } = useSubcategoryForm(
    categoryId,
    subcategoryId,
    onSuccess
  );
  
  // Carregar dados da subcategoria existente
  useEffect(() => {
    if (subcategoryId) {
      const loadSubcategory = async () => {
        const { data, error } = await supabase
          .from("product_subcategories")
          .select("*")
          .eq("id", subcategoryId)
          .single();

        if (error) {
          console.error("Erro ao carregar subcategoria:", error);
          return;
        }

        if (data) {
          form.reset({
            name: data.name,
            description: data.description || "",
            default_fields: data.default_fields || {},
          });
        }
      };

      loadSubcategory();
    }
  }, [subcategoryId, form]);

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardHeader>
            <SubcategoryFormHeader isEdit={!!subcategoryId} />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <SubcategoryFormFields form={form} />
            <CustomFieldsList form={form} />
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : subcategoryId
                ? "Atualizar Subcategoria"
                : "Criar Subcategoria"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
