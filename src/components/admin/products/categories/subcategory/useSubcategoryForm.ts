
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

// Definindo o schema do formulário
export const subcategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  default_fields: z.record(z.any()).optional(),
});

// Tipo derivado do schema
export type FormFields = z.infer<typeof subcategorySchema>;

// Função para converter objeto aninhado em um formato plano
export const convertToRecord = (obj: any): Record<string, any> => {
  if (!obj) return {};
  if (typeof obj !== 'object') return {};
  return obj;
};

export const useSubcategoryForm = (
  categoryId: string,
  subcategoryId?: string,
  onSuccess?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: "",
      description: "",
      default_fields: {},
    },
  });

  const handleFormSubmit = async (data: FormFields) => {
    setIsSubmitting(true);
    try {
      if (subcategoryId) {
        // Atualizar subcategoria existente
        const { error } = await supabase
          .from("product_subcategories")
          .update({
            name: data.name,
            description: data.description,
            default_fields: data.default_fields || {},
          })
          .eq("id", subcategoryId);

        if (error) throw error;
        toast.success("Subcategoria atualizada com sucesso!");
      } else {
        // Criar nova subcategoria
        const { error } = await supabase
          .from("product_subcategories")
          .insert([
            {
              name: data.name,
              description: data.description,
              category_id: categoryId,
              default_fields: data.default_fields || {},
            },
          ]);

        if (error) throw error;
        toast.success("Subcategoria criada com sucesso!");
        form.reset();
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar subcategoria:", error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleFormSubmit,
    convertToRecord,
  };
};
