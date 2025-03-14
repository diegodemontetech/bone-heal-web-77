
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
      
      // Usando uma dupla assertiva de tipo para quebrar a cadeia de inferência
      setStages(data as unknown as CRMStage[]);
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
        // Usando uma dupla assertiva de tipo para quebrar a cadeia de inferência
        const newStage = data[0] as unknown as CRMStage;
        setStages([...stages, newStage]);
        toast.success("Estágio criado com sucesso!");
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
        // Usando uma dupla assertiva de tipo para quebrar a cadeia de inferência
        const updatedStage = data[0] as unknown as CRMStage;
        setStages(
          stages.map((stage) =>
            stage.id === stageId
              ? { ...stage, ...updatedStage }
              : stage
          )
        );
        toast.success("Estágio atualizado com sucesso!");
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

  // Adicione a função para atualizar um campo específico do estágio
  const handleUpdateStageField = (stage: CRMStage, field: string, value: string) => {
    const updatedStages = stages.map((s) => {
      if (s.id === stage.id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    
    setStages(updatedStages);
    
    // Persistir a mudança no banco de dados
    supabase
      .from("crm_stages")
      .update({ [field]: value })
      .eq("id", stage.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating stage field:", error);
          toast.error("Erro ao atualizar campo do estágio");
          // Reverter as mudanças se houver erro
          setStages(stages);
        }
      });
  };

  // Adicione a função para ordenar estágios após drag and drop
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const reorderedStages = Array.from(stages);
    const [movedStage] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, movedStage);
    
    // Atualizar a ordem localmente
    const updatedStages = reorderedStages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));
    
    setStages(updatedStages);
    
    // Persistir a nova ordem no banco de dados
    try {
      for (const stage of updatedStages) {
        await supabase
          .from("crm_stages")
          .update({ order: stage.order })
          .eq("id", stage.id);
      }
      
      toast.success("Ordem dos estágios atualizada");
    } catch (error) {
      console.error("Error updating stages order:", error);
      toast.error("Erro ao atualizar ordem dos estágios");
      // Recarregar os estágios em caso de erro
      fetchStages();
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
    handleDeleteStage,
    handleUpdateStageField,
    handleDragEnd
  };
};
