import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StageWithPipeline } from "@/types/crm";

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<StageWithPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<StageWithPipeline | null>(null);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_stages')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('order', { ascending: true });

      if (error) throw error;
      setStages(data as StageWithPipeline[]);
    } catch (error) {
      console.error('Erro ao buscar estágios:', error);
      toast.error('Erro ao carregar estágios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pipelineId) {
      fetchStages();
    }
  }, [pipelineId]);

  const handleOpenDialog = (stage?: StageWithPipeline) => {
    setCurrentStage(stage || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentStage(null);
  };

  const createStage = async (name: string) => {
    setLoading(true);
    try {
      const newOrder = stages.length > 0 ? stages[stages.length - 1].order + 1 : 1;
      const { data, error } = await supabase
        .from('crm_stages')
        .insert([{ pipeline_id: pipelineId, name: name, order: newOrder }])
        .select()
        .single();

      if (error) throw error;

      setStages([...stages, data]);
      toast.success('Estágio criado com sucesso!');
      handleCloseDialog();
      fetchStages();
    } catch (error: any) {
      console.error('Erro ao criar estágio:', error);
      toast.error(`Erro ao criar estágio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (stageId: string, newName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('crm_stages')
        .update({ name: newName })
        .eq('id', stageId);

      if (error) throw error;

      setStages(stages.map(stage => stage.id === stageId ? { ...stage, name: newName } : stage));
      toast.success('Estágio atualizado com sucesso!');
      handleCloseDialog();
      fetchStages();
    } catch (error: any) {
      console.error('Erro ao atualizar estágio:', error);
      toast.error(`Erro ao atualizar estágio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteStage = async (stageId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('crm_stages')
        .delete()
        .eq('id', stageId);

      if (error) throw error;

      setStages(stages.filter(stage => stage.id !== stageId));
      toast.success('Estágio excluído com sucesso!');
      fetchStages();
    } catch (error: any) {
      console.error('Erro ao excluir estágio:', error);
      toast.error(`Erro ao excluir estágio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStagesOrder = async (reorderedStages: StageWithPipeline[]) => {
  try {
    const updateData = reorderedStages.map(stage => ({
      id: stage.id,
      name: stage.name, // Adicionando o campo name que é obrigatório
      order: stage.order,
    }));

    const { error } = await supabase
      .from('crm_stages')
      .upsert(updateData);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar ordem dos estágios:', error);
    return false;
  }
};

  return {
    stages,
    loading,
    isDialogOpen,
    currentStage,
    handleOpenDialog,
    handleCloseDialog,
    createStage,
    updateStage,
    deleteStage,
    setStages,
    updateStagesOrder,
    fetchStages
  };
};
