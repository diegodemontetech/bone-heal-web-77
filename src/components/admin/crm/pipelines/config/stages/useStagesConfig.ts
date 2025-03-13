
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StageWithPipeline } from "@/types/crm";
import { DropResult } from "@hello-pangea/dnd";

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<StageWithPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingStage, setAddingStage] = useState(false);

  useEffect(() => {
    fetchStages();
  }, [pipelineId]);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("order");

      if (error) throw error;
      
      // Garantir que todos os estágios tenham pipeline_id definido
      const stagesWithPipeline = data.map(stage => ({
        ...stage,
        pipeline_id: pipelineId // Garantir que o pipeline_id está presente
      })) as StageWithPipeline[];
      
      setStages(stagesWithPipeline);
    } catch (err) {
      console.error("Erro ao buscar estágios:", err);
      toast.error("Erro ao carregar estágios");
    } finally {
      setLoading(false);
    }
  };

  const addStage = async (newStage: { name: string; color: string }) => {
    setAddingStage(true);
    try {
      // Encontrar o maior order para colocar o novo estágio no final
      const maxOrder = stages.length > 0 
        ? Math.max(...stages.map(stage => stage.order)) 
        : 0;

      const { data, error } = await supabase
        .from("crm_stages")
        .insert({
          name: newStage.name,
          color: newStage.color,
          order: maxOrder + 1,
          pipeline_id: pipelineId
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar o novo estágio com pipeline_id garantido
      setStages([...stages, data as StageWithPipeline]);
      toast.success("Estágio adicionado com sucesso");
    } catch (err) {
      console.error("Erro ao adicionar estágio:", err);
      toast.error("Erro ao adicionar estágio");
    } finally {
      setAddingStage(false);
    }
  };

  const updateStage = async (stage: StageWithPipeline, field: string, value: string) => {
    const updatedStage = { ...stage, [field]: value };
    
    try {
      // Atualizar na UI primeiro para feedback instantâneo
      setStages(stages.map(s => s.id === stage.id ? updatedStage : s));
      
      // Enviar atualização para o servidor
      const { error } = await supabase
        .from("crm_stages")
        .update({ [field]: value })
        .eq("id", stage.id);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar estágio:", err);
      toast.error("Erro ao atualizar estágio");
      
      // Reverter mudança na UI se houver erro
      setStages(stages.map(s => s.id === stage.id ? stage : s));
    }
  };

  const deleteStage = async (stageId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este estágio?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("crm_stages")
        .delete()
        .eq("id", stageId);

      if (error) throw error;

      setStages(stages.filter(stage => stage.id !== stageId));
      toast.success("Estágio excluído com sucesso");
    } catch (err) {
      console.error("Erro ao excluir estágio:", err);
      toast.error("Erro ao excluir estágio");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    // Se não houver destino ou o item for arrastado para o mesmo lugar, não fazer nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Reordenar os estágios
    const reorderedStages = Array.from(stages);
    const [removed] = reorderedStages.splice(source.index, 1);
    reorderedStages.splice(destination.index, 0, removed);

    // Atualizar a ordem
    const updatedStages = reorderedStages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));

    // Atualizar estado localmente primeiro
    setStages(updatedStages);

    // Atualizar no banco de dados
    try {
      // Criar um array de atualizações para enviar
      const updates = updatedStages.map(stage => ({
        id: stage.id,
        order: stage.order
      }));

      // Fazer atualizações em massa (upsert)
      const { error } = await supabase
        .from("crm_stages")
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar ordem dos estágios:", err);
      toast.error("Erro ao atualizar ordem");
      
      // Reverter para o estado anterior em caso de erro
      fetchStages();
    }
  };

  return {
    stages,
    loading,
    addingStage,
    addStage,
    updateStage,
    deleteStage,
    handleDragEnd
  };
};
