
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fieldSchema, FieldFormValues } from "./types";

export const useFieldForm = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldType, setFieldType] = useState("text");

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: "",
      label: "",
      type: "text",
      required: false,
      display_in_kanban: false,
      options: "",
      mask: "",
      default_value: "",
    },
  });

  const watchType = form.watch("type");

  const onSubmit = async (data: FieldFormValues) => {
    try {
      setIsLoading(true);
      
      // Processar opções para select, radio, checkbox
      let processedOptions = null;
      if (["select", "radio", "checkbox"].includes(data.type) && data.options) {
        processedOptions = data.options.split(",").map(option => option.trim());
      }
      
      const { error } = await supabase
        .from("crm_fields")
        .insert([{ 
          name: data.name,
          label: data.label,
          type: data.type,
          required: data.required,
          display_in_kanban: data.display_in_kanban,
          options: processedOptions,
          mask: data.mask || null,
          default_value: data.default_value || null
        }]);

      if (error) throw error;
      
      toast.success("Campo criado com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar campo:", error);
      toast.error(`Erro ao criar campo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultMask = (type: string) => {
    switch (type) {
      case "phone": return "(99) 99999-9999";
      case "cpf": return "999.999.999-99";
      case "cnpj": return "99.999.999/9999-99";
      case "cep": return "99999-999";
      case "money": return "R$ #.##0,00";
      default: return "";
    }
  };

  return {
    form,
    isLoading,
    fieldType,
    setFieldType,
    watchType,
    onSubmit,
    getDefaultMask
  };
};
