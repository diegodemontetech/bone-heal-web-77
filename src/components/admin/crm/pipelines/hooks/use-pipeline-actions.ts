
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Pipeline } from "@/types/crm";

interface SimplePipeline {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  form_url?: string;
}

interface UsePipelineActionsProps {
  pipelines?: SimplePipeline[];
  onPipelinesChange?: (pipelines: SimplePipeline[]) => void;
}

export const usePipelineActions = ({ 
  pipelines = [], 
  onPipelinesChange 
}: UsePipelineActionsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleActivate = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Update pipeline status in the database
      const { error } = await supabase
        .from("crm_pipelines")
        .update({ is_active: true })
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state
      const updatedPipelines = pipelines.map(pipeline => 
        pipeline.id === id ? { ...pipeline, is_active: true } : pipeline
      );
      
      if (onPipelinesChange) {
        onPipelinesChange(updatedPipelines);
      }
      
      toast.success("Pipeline ativado com sucesso");
    } catch (error: any) {
      console.error("Erro ao ativar pipeline:", error);
      toast.error(error.message || "Erro ao ativar pipeline");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeactivate = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Update pipeline status in the database
      const { error } = await supabase
        .from("crm_pipelines")
        .update({ is_active: false })
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state
      const updatedPipelines = pipelines.map(pipeline => 
        pipeline.id === id ? { ...pipeline, is_active: false } : pipeline
      );
      
      if (onPipelinesChange) {
        onPipelinesChange(updatedPipelines);
      }
      
      toast.success("Pipeline desativado com sucesso");
    } catch (error: any) {
      console.error("Erro ao desativar pipeline:", error);
      toast.error(error.message || "Erro ao desativar pipeline");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este pipeline? Esta ação não pode ser desfeita.");
    
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      
      // Delete pipeline from database
      const { error } = await supabase
        .from("crm_pipelines")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state by removing the deleted pipeline
      const updatedPipelines = pipelines.filter(pipeline => pipeline.id !== id);
      
      if (onPipelinesChange) {
        onPipelinesChange(updatedPipelines);
      }
      
      toast.success("Pipeline excluído com sucesso");
    } catch (error: any) {
      console.error("Erro ao excluir pipeline:", error);
      toast.error(error.message || "Erro ao excluir pipeline");
    } finally {
      setIsLoading(false);
    }
  };

  // Aliases para manter compatibilidade com a versão anterior
  const deletePipeline = handleDelete;
  
  const handleConfigure = (id: string) => {
    navigate(`/admin/pipelines/${id}/configurar`);
  };
  
  const handleView = (id: string) => {
    // Navigate to the pipeline view page
    navigate(`/admin/pipelines/${id}`);
  };
  
  const handleCopyUrl = (formUrl: string) => {
    navigator.clipboard.writeText(formUrl)
      .then(() => toast.success("URL copiada para a área de transferência"))
      .catch(error => {
        console.error("Erro ao copiar URL:", error);
        toast.error("Erro ao copiar URL");
      });
  };

  const duplicatePipeline = async (pipeline: Pipeline) => {
    try {
      setIsLoading(true);
      
      const duplicateName = `${pipeline.name} (cópia)`;
      
      // Create a new pipeline based on the original
      const { data, error } = await supabase
        .from("crm_pipelines")
        .insert({
          name: duplicateName,
          description: pipeline.description,
          is_active: false // Start inactive by default
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state to include the new pipeline
      if (data && onPipelinesChange) {
        onPipelinesChange([data, ...pipelines]);
      }
      
      toast.success("Pipeline duplicado com sucesso");
    } catch (error: any) {
      console.error("Erro ao duplicar pipeline:", error);
      toast.error(error.message || "Erro ao duplicar pipeline");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleActivate,
    handleDeactivate,
    handleDelete,
    handleConfigure,
    handleView,
    handleCopyUrl,
    deletePipeline,
    duplicatePipeline
  };
};
