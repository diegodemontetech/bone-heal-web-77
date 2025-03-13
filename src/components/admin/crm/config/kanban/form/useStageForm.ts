
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Department } from "@/types/crm";

const stageSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  color: z.string().min(4, "Selecione uma cor"),
  department_id: z.string().uuid("Selecione um departamento"),
  order: z.coerce.number().int().positive(),
});

export type StageFormValues = z.infer<typeof stageSchema>;

export function useStageForm(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
      order: 1,
    },
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from("crm_departments")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setDepartments(data || []);
      } catch (error: any) {
        console.error("Erro ao buscar departamentos:", error);
        toast.error("Erro ao carregar departamentos");
      }
    };

    fetchDepartments();
  }, []);

  const onSubmit = async (data: StageFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("crm_stages")
        .insert([{ 
          name: data.name,
          color: data.color,
          department_id: data.department_id,
          order: data.order,
          pipeline_id: "" // Valor padrão vazio para satisfazer o tipo
        }]);

      if (error) throw error;
      
      toast.success("Estágio criado com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar estágio:", error);
      toast.error(`Erro ao criar estágio: ${error.message}`);
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
}
