import { useState, useEffect } from "react";
import { CRMStage } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<CRMStage | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStages();
  }, [pipelineId]);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_stages')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('order', { ascending: true });

      if (error) throw error;

      setStages(data as CRMStage[]);
    } catch (error) {
      console.error('Erro ao buscar estágios:', error);
      toast.error('Não foi possível carregar os estágios. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (stage?: CRMStage) => {
    setCurrentStage(stage || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentStage(null);
  };

  const handleCreateStage = async (stageData: Omit<CRMStage, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('crm_stages')
        .insert([{ ...stageData, pipeline_id: pipelineId }])
        .select()
        .single();

      if (error) throw error;

      setStages([...stages, data as CRMStage]);
      toast.success('Estágio criado com sucesso!');
      fetchStages(); // Recarrega os estágios para atualizar a lista
    } catch (error) {
      console.error('Erro ao criar estágio:', error);
      toast.error('Não foi possível criar o estágio. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
      handleCloseDialog();
    }
  };

  const handleUpdateStage = async (stageId: string, stageData: Omit<CRMStage, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('crm_stages')
        .update(stageData)
        .eq('id', stageId);

      if (error) throw error;

      setStages(stages.map(stage => stage.id === stageId ? { ...stage, ...stageData } : stage));
      toast.success('Estágio atualizado com sucesso!');
      fetchStages(); // Recarrega os estágios para atualizar a lista
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
      toast.error('Não foi possível atualizar o estágio. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
      handleCloseDialog();
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este estágio?')) {
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from('crm_stages')
          .delete()
          .eq('id', stageId);

        if (error) throw error;

        setStages(stages.filter(stage => stage.id !== stageId));
        toast.success('Estágio excluído com sucesso!');
        fetchStages(); // Recarrega os estágios para atualizar a lista
      } catch (error) {
        console.error('Erro ao excluir estágio:', error);
        toast.error('Não foi possível excluir o estágio. Por favor, tente novamente.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return {
    stages,
    loading,
    isDialogOpen,
    currentStage,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleCreateStage,
    handleUpdateStage,
    handleDeleteStage,
  };
};
