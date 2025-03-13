
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Department, StageFormValues } from "@/types/crm";

const stageSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
  department_id: z.string().min(1, "Departamento é obrigatório"),
  order: z.number().int().positive("Ordem deve ser um número positivo").optional(),
  pipeline_id: z.string().optional(),
});

export interface UseStageFormProps {
  onSuccess?: () => void;
  initialData?: Partial<StageFormValues>;
}

export const useStageForm = ({ onSuccess, initialData }: UseStageFormProps = {}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: initialData?.name || "",
      color: initialData?.color || "#3b82f6",
      department_id: initialData?.department_id || "",
      order: initialData?.order || 0,
      pipeline_id: initialData?.pipeline_id || undefined,
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_departments")
        .select("*")
        .order("name");

      if (error) throw error;
      setDepartments(data || []);

      // Se houver apenas um departamento, auto-selecione-o
      if (data?.length === 1 && !initialData?.department_id) {
        form.setValue("department_id", data[0].id);
      }
    } catch (err) {
      console.error("Erro ao buscar departamentos:", err);
      toast.error("Erro ao carregar departamentos");
    }
  };

  const onSubmit = async (values: StageFormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .insert({
          name: values.name,
          color: values.color,
          department_id: values.department_id,
          order: values.order || 0,
          pipeline_id: values.pipeline_id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Estágio criado com sucesso!");
      form.reset({
        name: "",
        color: "#3b82f6",
        department_id: values.department_id,
        order: 0,
        pipeline_id: values.pipeline_id,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Erro ao criar estágio:", err);
      toast.error(err.message || "Erro ao criar estágio");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    departments,
    isLoading,
    onSubmit,
  };
};
