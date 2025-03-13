
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFields } from "../types";
import { ProductCategory, ProductSubcategory } from "@/types/product";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseSubcategoryFormProps {
  category: ProductCategory;
  subcategory?: ProductSubcategory | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function useSubcategoryForm({ 
  category, 
  subcategory, 
  onSuccess, 
  onClose 
}: UseSubcategoryFormProps) {
  const [customFields, setCustomFields] = useState<Record<string, any>>(
    subcategory?.default_fields || {}
  );

  const handleFieldChange = (fieldName: string, value: any) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleAddField = () => {
    setCustomFields(prev => ({
      ...prev,
      [`campo_${Object.keys(prev).length + 1}`]: ""
    }));
  };

  // Schema para validação do formulário
  const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    description: z.string().optional(),
    default_fields: z.record(z.any()).optional()
  });

  // Criando o formulário
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcategory?.name || "",
      description: subcategory?.description || "",
      default_fields: subcategory?.default_fields || {}
    }
  });

  const onSubmit = async (data: FormFields) => {
    try {
      // Incluindo os campos personalizados no envio
      data.default_fields = customFields;
      
      if (subcategory) {
        // Atualizar subcategoria existente
        const { error } = await supabase
          .from("product_subcategories")
          .update({
            name: data.name,
            description: data.description,
            default_fields: data.default_fields
          })
          .eq("id", subcategory.id);
          
        if (error) throw error;
        toast.success("Subcategoria atualizada com sucesso!");
      } else {
        // Criar nova subcategoria
        const { error } = await supabase
          .from("product_subcategories")
          .insert({
            name: data.name,
            description: data.description,
            default_fields: data.default_fields,
            category_id: category.id
          });
          
        if (error) throw error;
        toast.success("Subcategoria criada com sucesso!");
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar subcategoria:", error);
      toast.error(`Erro: ${error.message}`);
    }
  };

  return {
    form,
    customFields,
    handleFieldChange,
    handleAddField,
    onSubmit
  };
}
