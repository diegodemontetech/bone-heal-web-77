
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMStage } from "@/types/crm";
import { StageFormData } from "./NewStageForm";

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<CRMStage | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchStages = async () => {
    if (!pipelineId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("order", { ascending: true });

      if (error) throw error;
      
      setStages(data as CRMStage[]);
    } catch (error) {
      console.error("Error fetching stages:", error);
      toast.error("Erro ao carregar estágios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, [pipelineId]);

  const handleCreateStage = async (formData: StageFormData) => {
    try {
      setIsSaving(true);
      // Calcular a ordem para o novo estágio
      let newOrder = 1;
      if (stages.length > 0) {
        const maxOrder = Math.max(...stages.map(s => s.order));
        newOrder = maxOrder + 1;
      }

      const { data, error } = await supabase
        .from("crm_stages")
        .insert([
          {
            name: formData.name,
            color: formData.color,
            order: newOrder,
            pipeline_id: pipelineId,
            department_id: formData.department_id,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setStages([...stages, data[0] as CRMStage]);
        toast.success("Estágio criado com sucesso!");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating stage:", error);
      toast.error("Erro ao criar estágio");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStage = async (
    stageId: string,
    formData: StageFormData
  ) => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from("crm_stages")
        .update({
          name: formData.name,
          color: formData.color,
          department_id: formData.department_id,
        })
        .eq("id", stageId)
        .select();

      if (error) throw error;

      if (data) {
        setStages(
          stages.map((stage) =>
            stage.id === stageId
              ? { ...stage, ...data[0] as Partial<CRMStage> }
              : stage
          )
        );
        toast.success("Estágio atualizado com sucesso!");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error("Erro ao atualizar estágio");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      const { error } = await supabase
        .from("crm_stages")
        .delete()
        .eq("id", stageId);

      if (error) throw error;

      setStages(stages.filter((stage) => stage.id !== stageId));
      toast.success("Estágio excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting stage:", error);
      toast.error("Erro ao excluir estágio");
    }
  };

  return {
    stages,
    loading,
    isDialogOpen,
    currentStage,
    isSaving,
    handleOpenDialog: (stage?: CRMStage) => {
      setCurrentStage(stage || null);
      setIsDialogOpen(true);
    },
    handleCloseDialog: () => {
      setCurrentStage(null);
      setIsDialogOpen(false);
    },
    handleCreateStage,
    handleUpdateStage,
    handleDeleteStage
  };
};
