
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StageWithPipeline, CRMStage } from "@/types/crm";
import { DropResult } from "@hello-pangea/dnd";

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<StageWithPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      
      // Garantir que todos os estágios tenham pipeline_id
      const stagesWithPipeline: StageWithPipeline[] = data.map(stage => ({
        ...stage,
        pipeline_id: pipelineId,
      })) as StageWithPipeline[];
      
      setStages(stagesWithPipeline);
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

  const handleAddStage = async (data: { name: string, color: string }) => {
    setSaving(true);
    try {
      const newOrder = stages.length > 0 ? Math.max(...stages.map(s => s.order)) + 1 : 1;
      const newStage = {
        pipeline_id: pipelineId,
        name: data.name,
        color: data.color,
        order: newOrder
      };

      const { data: createdStage, error } = await supabase
        .from('crm_stages')
        .insert([newStage])
        .select()
        .single();

      if (error) throw error;

      setStages([...stages, createdStage as StageWithPipeline]);
      toast.success('Estágio criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar estágio:', error);
      toast.error(`Erro ao criar estágio: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStage = async (stage: StageWithPipeline, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('crm_stages')
        .update({ [field]: value })
        .eq('id', stage.id);

      if (error) throw error;

      setStages(stages.map(s => s.id === stage.id ? { ...s, [field]: value } : s));
    } catch (error: any) {
      console.error('Erro ao atualizar estágio:', error);
      toast.error(`Erro ao atualizar estágio: ${error.message}`);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      const { error } = await supabase
        .from('crm_stages')
        .delete()
        .eq('id', stageId);

      if (error) throw error;

      setStages(stages.filter(stage => stage.id !== stageId));
      toast.success('Estágio excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir estágio:', error);
      toast.error(`Erro ao excluir estágio: ${error.message}`);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    const reorderedStages = Array.from(stages);
    const [removed] = reorderedStages.splice(source.index, 1);
    reorderedStages.splice(destination.index, 0, removed);
    
    // Atualizar a ordem dos estágios
    const updatedStages = reorderedStages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));
    
    setStages(updatedStages);
    
    try {
      const updatePromises = updatedStages.map(stage => 
        supabase
          .from('crm_stages')
          .update({ order: stage.order })
          .eq('id', stage.id)
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Erro ao reordenar estágios:', error);
      toast.error('Erro ao salvar a nova ordem dos estágios');
      fetchStages(); // Recarregar os estágios em caso de erro
    }
  };

  return {
    stages,
    loading,
    saving,
    isDialogOpen,
    currentStage,
    handleOpenDialog,
    handleCloseDialog,
    handleAddStage,
    handleUpdateStage,
    handleDeleteStage,
    setStages,
    onDragEnd,
    fetchStages
  };
};
