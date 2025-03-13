
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CRMStage } from "@/types/crm";

interface AutomationFormData {
  stage: string;
  next_stage: string;
  hours_trigger: number;
  action_type: string;
  action_data: {
    subject: string;
    content: string;
    to_field: string;
  };
  is_active: boolean;
}

interface UseAutomationFormProps {
  onSuccess?: () => void;
}

export function useAutomationForm({ onSuccess }: UseAutomationFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [formData, setFormData] = useState<AutomationFormData>({
    stage: "",
    next_stage: "",
    hours_trigger: 24,
    action_type: "email",
    action_data: {
      subject: "",
      content: "",
      to_field: "email"
    },
    is_active: true
  });
  const [activeTab, setActiveTab] = useState("email");

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        throw error;
      }

      // Aqui precisamos garantir que o tipo retornado está conforme esperado
      const stagesWithPipelineId = data?.map(stage => ({
        ...stage,
        pipeline_id: stage.pipeline_id || ""  // Garantir que pipeline_id sempre existe
      })) as CRMStage[];
      
      setStages(stagesWithPipelineId);
    } catch (error: any) {
      console.error("Erro ao buscar estágios:", error);
      toast.error("Não foi possível carregar os estágios");
    }
  };

  const handleStageChange = (value: string) => {
    setFormData(prev => ({ ...prev, stage: value }));
  };

  const handleNextStageChange = (value: string) => {
    setFormData(prev => ({ ...prev, next_stage: value }));
  };

  const handleHoursTriggerChange = (value: number) => {
    setFormData(prev => ({ ...prev, hours_trigger: value }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData(prev => ({ ...prev, action_type: value }));
  };

  const handleActionDataChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      action_data: { ...prev.action_data, [name]: value }
    }));
  };

  const handleToggleActive = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const resetForm = () => {
    setFormData({
      stage: "",
      next_stage: "",
      hours_trigger: 24,
      action_type: "email",
      action_data: {
        subject: "",
        content: "",
        to_field: "email"
      },
      is_active: true
    });
    setActiveTab("email");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("crm_stage_automations")
        .insert([formData]);

      if (error) throw error;

      toast.success("Automação criada com sucesso!");
      resetForm();
      
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
    isLoading,
    stages,
    formData,
    activeTab,
    handleStageChange,
    handleNextStageChange,
    handleHoursTriggerChange,
    handleTabChange,
    handleActionDataChange,
    handleToggleActive,
    handleSubmit
  };
}
