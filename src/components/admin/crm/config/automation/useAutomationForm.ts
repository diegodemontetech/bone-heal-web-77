
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CRMStage, Department, AutomationFormValues } from "@/types/crm";

const automationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  trigger_type: z.enum(["stage_change", "time_in_stage", "lead_created"]),
  stage_id: z.string().optional(),
  hours_trigger: z.coerce.number().int().min(1).optional(),
  action_type: z.enum(["notification", "stage_change", "assign_user", "webhook"]),
  next_stage_id: z.string().optional(),
  user_id: z.string().optional(),
  webhook_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
});

type AutomationFormSchemaValues = z.infer<typeof automationSchema>;

interface UseAutomationFormProps {
  onSuccess?: () => void;
}

export function useAutomationForm({ onSuccess }: UseAutomationFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState<AutomationFormValues>({
    stage_id: '',
    action_type: 'notification',
    action_data: {},
    is_active: true
  });
  const [activeTab, setActiveTab] = useState<string>("notification");

  const form = useForm<AutomationFormSchemaValues>({
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

  const handleStageChange = (stageId: string) => {
    setFormData(prev => ({ ...prev, stage_id: stageId }));
  };

  const handleNextStageChange = (stageId: string) => {
    setFormData(prev => ({ ...prev, next_stage_id: stageId }));
  };

  const handleHoursTriggerChange = (hours: number) => {
    setFormData(prev => ({ ...prev, hours_trigger: hours }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFormData(prev => ({ 
      ...prev, 
      action_type: tab as "notification" | "stage_change" | "assign_user" | "webhook"
    }));
  };

  const handleActionDataChange = (data: any) => {
    setFormData(prev => ({ ...prev, action_data: { ...prev.action_data, ...data } }));
  };

  const handleToggleActive = (isActive: boolean) => {
    setFormData(prev => ({ ...prev, is_active: isActive }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form data
      if (!formData.stage_id) {
        toast.error("Selecione um estágio para o gatilho");
        return;
      }
      
      if (formData.action_type === 'stage_change' && !formData.next_stage_id) {
        toast.error("Selecione um estágio para a ação");
        return;
      }
      
      // Prepare data for insertion
      const dataToInsert = {
        stage: formData.stage_id,  // Renomeando para corresponder à coluna do banco
        next_stage: formData.next_stage_id,  // Renomeando para corresponder à coluna do banco
        hours_trigger: formData.hours_trigger,
        action_type: formData.action_type,
        action_data: formData.action_data,
        is_active: formData.is_active
      };
      
      // Insert automation data into the correct table
      const { data, error } = await supabase
        .from("crm_stage_automations")
        .insert(dataToInsert)
        .select();

      if (error) throw error;
      
      toast.success("Automação criada com sucesso!");
      
      // Reset form state
      setFormData({
        stage_id: '',
        action_type: 'notification',
        action_data: {},
        is_active: true
      });
      
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
    formData,
    activeTab,
    handleStageChange,
    handleNextStageChange,
    handleHoursTriggerChange,
    handleTabChange,
    handleActionDataChange,
    handleToggleActive,
    handleSubmit,
    onSubmit: form.handleSubmit(values => {
      console.log("Form values:", values);
    }),
  };
}
