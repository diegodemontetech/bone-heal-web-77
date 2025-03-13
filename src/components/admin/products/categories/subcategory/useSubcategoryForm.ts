
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Definição do schema de validação
export const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  default_fields: z.record(z.any()).optional()
});

// Tipo derivado do schema
export type FormFields = z.infer<typeof formSchema>;

interface UseSubcategoryFormProps {
  categoryId: string;
  subcategoryId?: string;
  initialData?: any;
  onSuccess: () => Promise<void>;
}

export const useSubcategoryForm = ({
  categoryId,
  subcategoryId,
  initialData,
  onSuccess
}: UseSubcategoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para converter dados do banco de dados em objeto Record
  const convertToRecord = (data: any): Record<string, any> => {
    if (!data) return {};
    if (typeof data === 'object' && !Array.isArray(data)) return data;
    return {};
  };

  // Inicialização do formulário com os dados existentes, se disponíveis
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      default_fields: convertToRecord(initialData?.default_fields) || {}
    }
  });

  // Função para lidar com o envio do formulário
  const handleFormSubmit = async (values: FormFields) => {
    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        name: values.name,
        description: values.description || "",
        default_fields: values.default_fields || {},
        category_id: categoryId
      };
      
      if (subcategoryId) {
        // Atualizar subcategoria existente
        const { error } = await supabase
          .from("product_subcategories")
          .update(dataToSave)
          .eq("id", subcategoryId);
          
        if (error) throw error;
        toast.success("Subcategoria atualizada com sucesso");
      } else {
        // Criar nova subcategoria
        const { error } = await supabase
          .from("product_subcategories")
          .insert([dataToSave]);
          
        if (error) throw error;
        toast.success("Subcategoria criada com sucesso");
      }
      
      await onSuccess();
      form.reset();
    } catch (error: any) {
      console.error("Erro ao salvar subcategoria:", error);
      toast.error(error.message || "Erro ao salvar subcategoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleFormSubmit,
    onSubmit: form.handleSubmit(handleFormSubmit)
  };
};
