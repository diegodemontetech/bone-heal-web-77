
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";

export const flowFormSchema = z.object({
  name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  department_id: z.string().optional(),
  responsible_id: z.string().optional(),
  has_attachment: z.boolean().default(false),
});

export type FlowFormValues = z.infer<typeof flowFormSchema>;

export const useFlowFormData = (
  onCreateFlow: (name: string, description: string, departmentId?: string, responsibleId?: string, hasAttachment?: boolean) => Promise<any>,
  onComplete: () => void,
  onClose?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FlowFormValues>({
    resolver: zodResolver(flowFormSchema),
    defaultValues: {
      name: "",
      description: "",
      department_id: undefined,
      responsible_id: undefined,
      has_attachment: false,
    },
  });

  // Consulta para buscar departamentos
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Consulta para buscar usuários
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleCreate = async (values: FlowFormValues) => {
    try {
      setIsSubmitting(true);
      
      const result = await onCreateFlow(
        values.name, 
        values.description || "", 
        values.department_id,
        values.responsible_id,
        values.has_attachment
      );
      
      if (result) {
        form.reset();
        toast.success("Pipeline criado com sucesso!");
        onComplete();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Erro ao criar pipeline:", error);
      toast.error("Erro ao criar pipeline. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    departments,
    users,
    handleCreate
  };
};
