import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CRMStage, Department } from "@/types/crm";

const automationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  trigger_type: z.enum(["stage_change", "time_in_stage", "lead_created"]),
  trigger_stage_id: z.string().optional(),
  trigger_time_hours: z.coerce.number().int().min(1).optional(),
  action_type: z.enum(["notification", "stage_change", "assign_user", "webhook"]),
  action_stage_id: z.string().optional(),
  action_user_id: z.string().optional(),
  action_webhook_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
});

type AutomationFormValues = z.infer<typeof automationSchema>;

interface UseAutomationFormProps {
  onSuccess?: () => void;
}

export function useAutomationForm({ onSuccess }: UseAutomationFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger_type: "stage_change",
      is_active: true,
      action_type: "notification",
    },
  });

  const triggerType = form.watch("trigger_type");
  const actionType = form.watch("action_type");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stages
        const { data: stagesData, error: stagesError } = await supabase
          .from("crm_stages")
          .select("*, crm_departments(name)")
          .order("order");

        if (stagesError) throw stagesError;

        // Fetch departments
        const { data: departmentsData, error: departmentsError } = await supabase
          .from("crm_departments")
          .select("*")
          .order("name");

        if (departmentsError) throw departmentsError;

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .order("full_name");

        if (usersError) throw usersError;

        // Process stages to ensure pipeline_id exists
        const processedStages = stagesData.map(stage => {
          const stageWithPipeline = { 
            ...stage, 
            pipeline_id: "pipeline_id" in stage ? stage.pipeline_id : "" 
          };
          return stageWithPipeline;
        });

        setStages(processedStages as CRMStage[]);
        setDepartments(departmentsData as Department[]);
        setUsers(usersData || []);
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados necessários");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: AutomationFormValues) => {
    try {
      setIsLoading(true);
      
      // Validate conditional fields
      if (data.trigger_type === "stage_change" && !data.trigger_stage_id) {
        toast.error("Selecione um estágio para o gatilho");
        return;
      }
      
      if (data.trigger_type === "time_in_stage" && !data.trigger_stage_id) {
        toast.error("Selecione um estágio para o gatilho");
        return;
      }
      
      if (data.trigger_type === "time_in_stage" && !data.trigger_time_hours) {
        toast.error("Defina o tempo em horas para o gatilho");
        return;
      }
      
      if (data.action_type === "stage_change" && !data.action_stage_id) {
        toast.error("Selecione um estágio para a ação");
        return;
      }
      
      if (data.action_type === "assign_user" && !data.action_user_id) {
        toast.error("Selecione um usuário para atribuir");
        return;
      }
      
      if (data.action_type === "webhook" && !data.action_webhook_url) {
        toast.error("Informe a URL do webhook");
        return;
      }
      
      const { error } = await supabase
        .from("crm_automations")
        .insert([data]);

      if (error) throw error;
      
      toast.success("Automação criada com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar automação:", error);
      toast.error(`Erro ao criar automação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    stages,
    departments,
    users,
    triggerType,
    actionType,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
