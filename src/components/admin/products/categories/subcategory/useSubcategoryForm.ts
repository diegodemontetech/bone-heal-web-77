
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductCategory, ProductSubcategory } from "@/types/product";
import { FormFields } from "../types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  default_fields: z.record(z.any()).optional(),
});

export function useSubcategoryForm(
  category: ProductCategory,
  subcategory: ProductSubcategory | null | undefined,
  onSuccess: () => void,
  onClose: () => void
) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Record<string, any>>({});

  useEffect(() => {
    if (subcategory) {
      setFields(subcategory.default_fields || {});
    } else {
      setFields({});
    }
  }, [subcategory]);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcategory?.name || "",
      description: subcategory?.description || "",
      default_fields: subcategory?.default_fields || {},
    },
  });

  const handleAddField = () => {
    const newFieldName = prompt("Nome do novo campo:");
    if (newFieldName) {
      handleFieldChange(newFieldName, "");
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const onSubmit = async (values: FormFields) => {
    setLoading(true);
    try {
      const upsertData = {
        name: values.name,
        description: values.description,
        category_id: category.id,
        default_fields: fields,
      };

      let response;
      if (subcategory) {
        response = await supabase
          .from("product_subcategories")
          .update(upsertData)
          .eq("id", subcategory.id);
      } else {
        response = await supabase
          .from("product_subcategories")
          .insert(upsertData);
      }

      if (response.error) {
        throw response.error;
      }

      toast.success(`Subcategoria ${subcategory ? 'atualizada' : 'criada'} com sucesso!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar subcategoria:", error);
      toast.error(`Erro ao salvar subcategoria: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    fields,
    handleAddField,
    handleFieldChange,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
