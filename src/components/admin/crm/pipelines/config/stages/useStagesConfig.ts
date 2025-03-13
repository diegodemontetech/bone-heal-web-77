import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CRMStage } from "@/types/crm";
import { DropResult } from "@hello-pangea/dnd";

interface StageFormData {
  name: string;
  color: string;
}

export const useStagesConfig = (pipelineId: string) => {
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      
      if (data) {
        // Garantir que todas as entradas tenham pipeline_id
        const formattedStages = data.map(stage => ({
          ...stage,
          pipeline_id: stage.pipeline_id || pipelineId
        })) as CRMStage[];
        
        setStages(formattedStages);
      }
    } catch (err) {
      console.error("Erro ao buscar estágios:", err);
      toast.error("Erro ao carregar estágios");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async (newStage: StageFormData) => {
    if (!newStage.name.trim()) {
      toast.error("O nome do estágio é obrigatório");
      return;
    }

    setSaving(true);
    try {
      const nextOrder = stages.length > 0 
        ? Math.max(...stages.map(s => s.order)) + 1 
        : 0;

      const { data, error } = await supabase
        .from("crm_stages")
        .insert({
          name: newStage.name,
          color: newStage.color,
          pipeline_id: pipelineId,
          order: nextOrder
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newStageWithCorrectType: CRMStage = {
          ...data,
          pipeline_id: data.pipeline_id || pipelineId
        };

        setStages([...stages, newStageWithCorrectType]);
        toast.success("Estágio adicionado com sucesso");
      }
    } catch (err) {
      console.error("Erro ao adicionar estágio:", err);
      toast.error("Erro ao adicionar estágio");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este estágio? Isso também excluirá todos os leads associados a ele.")) {
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

  const handleUpdateStage = async (stage: CRMStage, field: string, value: string) => {
    const updatedStage = { ...stage, [field]: value };
    
    try {
      const { error } = await supabase
        .from("crm_stages")
        .update({ [field]: value })
        .eq("id", stage.id);

      if (error) throw error;

      setStages(stages.map(s => s.id === stage.id ? updatedStage : s));
    } catch (err) {
      console.error("Erro ao atualizar estágio:", err);
      toast.error("Erro ao atualizar estágio");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const newStages = Array.from(stages);
    const [removed] = newStages.splice(source.index, 1);
    newStages.splice(destination.index, 0, removed);

    // Atualizar ordens
    const updatedStages = newStages.map((stage, index) => ({
      ...stage,
      order: index
    }));

    setStages(updatedStages);

    // Salvar novas ordens no banco
    try {
      for (const stage of updatedStages) {
        await supabase
          .from("crm_stages")
          .update({ order: stage.order })
          .eq("id", stage.id);
      }
    } catch (err) {
      console.error("Erro ao reordenar estágios:", err);
      toast.error("Erro ao salvar a nova ordem dos estágios");
      fetchStages(); // Recarregar estágios originais em caso de erro
    }
  };

  return {
    stages,
    loading,
    saving,
    handleAddStage,
    handleDeleteStage,
    handleUpdateStage,
    onDragEnd
  };
};
