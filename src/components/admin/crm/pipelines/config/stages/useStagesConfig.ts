
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useColorSort } from "./colorSort";
import { supabase } from "@/integrations/supabase/client";
import { CRMStage, StageWithPipeline } from "@/types/crm";

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<CRMStage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const sortedColors = useColorSort();

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
      
      // Tratando o problema de tipagem usando type assertion
      setStages(data as unknown as CRMStage[] || []);
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

  const handleOpenDialog = (stage?: CRMStage) => {
    setCurrentStage(stage || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentStage(null);
    setIsDialogOpen(false);
  };

  const handleCreateStage = async (formData: {
    name: string;
    color: string;
    department_id: string;
  }) => {
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
        setStages([...stages, data[0] as unknown as CRMStage]);
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
    formData: {
      name: string;
      color: string;
      department_id: string;
    }
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
              ? { ...stage, ...data[0] as unknown as CRMStage }
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

  const handleReorderStages = async (reorderedStages: CRMStage[]) => {
    try {
      // Atualiza a ordem localmente
      setStages(reorderedStages);

      // Prepara atualizações para o banco de dados
      const updates = reorderedStages.map((stage, index) => ({
        id: stage.id,
        order: index + 1,
      }));

      // Faz a atualização no banco de dados
      for (const update of updates) {
        const { error } = await supabase
          .from("crm_stages")
          .update({ order: update.order })
          .eq("id", update.id);

        if (error) throw error;
      }

      toast.success("Ordem atualizada com sucesso!");
    } catch (error) {
      console.error("Error reordering stages:", error);
      toast.error("Erro ao reordenar estágios");
      // Recarrega os estágios para garantir consistência
      fetchStages();
    }
  };

  return {
    stages,
    loading,
    isFormOpen,
    setIsFormOpen,
    isDialogOpen,
    setIsDialogOpen,
    currentStage,
    setCurrentStage,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleCreateStage,
    handleUpdateStage,
    handleDeleteStage,
    handleReorderStages,
    sortedColors,
  };
};
