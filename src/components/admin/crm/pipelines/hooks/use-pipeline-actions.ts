import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Pipeline } from "@/types/crm";

export const usePipelineActions = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPipeline = async (data: Omit<Pipeline, "id">) => {
    setLoading(true);
    try {
      const result: { data: any; error: any } = await supabase
        .from("crm_pipelines")
        .insert({
          name: data.name,
          description: data.description,
          is_active: data.is_active ?? true,
        })
        .select()
        .single();

      if (result.error) throw result.error;

      toast.success("Pipeline criado com sucesso!");
      return result.data;
    } catch (error: any) {
      console.error("Erro ao criar pipeline:", error);
      toast.error(`Erro ao criar pipeline: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePipeline = async (id: string, data: Partial<Pipeline>) => {
    setLoading(true);
    try {
      const result: { data: any; error: any } = await supabase
        .from("crm_pipelines")
        .update({
          name: data.name,
          description: data.description,
          is_active: data.is_active,
          form_url: data.form_url,
        })
        .eq("id", id)
        .select()
        .single();

      if (result.error) throw result.error;

      toast.success("Pipeline atualizado com sucesso!");
      return result.data;
    } catch (error: any) {
      console.error("Erro ao atualizar pipeline:", error);
      toast.error(`Erro ao atualizar pipeline: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePipeline = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este pipeline? Esta ação não pode ser desfeita.")) {
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("crm_pipelines")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Pipeline excluído com sucesso!");
      navigate("/admin/crm/pipelines");
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir pipeline:", error);
      toast.error(`Erro ao excluir pipeline: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const duplicatePipeline = async (pipeline: Pipeline) => {
    setLoading(true);
    try {
      // 1. Criar novo pipeline
      const { data: newPipeline, error: pipelineError } = await supabase
        .from("crm_pipelines")
        .insert({
          name: `${pipeline.name} (cópia)`,
          description: pipeline.description,
          is_active: pipeline.is_active,
        })
        .select()
        .single();

      if (pipelineError) throw pipelineError;

      // 2. Buscar estágios do pipeline original
      const { data: stages, error: stagesError } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", pipeline.id)
        .order("order");

      if (stagesError) throw stagesError;

      // 3. Duplicar estágios para o novo pipeline
      if (stages && stages.length > 0) {
        const newStages = stages.map((stage) => ({
          name: stage.name,
          color: stage.color,
          order: stage.order,
          pipeline_id: newPipeline.id,
        }));

        const { error: insertStagesError } = await supabase
          .from("crm_stages")
          .insert(newStages);

        if (insertStagesError) throw insertStagesError;
      }

      // 4. Buscar campos do pipeline original
      const { data: fields, error: fieldsError } = await supabase
        .from("crm_fields")
        .select("*")
        .eq("pipeline_id", pipeline.id);

      if (fieldsError) throw fieldsError;

      // 5. Duplicar campos para o novo pipeline
      if (fields && fields.length > 0) {
        const newFields = fields.map((field) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required,
          display_in_kanban: field.display_in_kanban,
          options: field.options,
          mask: field.mask,
          default_value: field.default_value,
          pipeline_id: newPipeline.id,
        }));

        const { error: insertFieldsError } = await supabase
          .from("crm_fields")
          .insert(newFields);

        if (insertFieldsError) throw insertFieldsError;
      }

      toast.success("Pipeline duplicado com sucesso!");
      return newPipeline;
    } catch (error: any) {
      console.error("Erro ao duplicar pipeline:", error);
      toast.error(`Erro ao duplicar pipeline: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createPipeline,
    updatePipeline,
    deletePipeline,
    duplicatePipeline,
  };
};
