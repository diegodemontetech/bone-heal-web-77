
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pipeline } from "@/types/crm";

export const usePipelineActions = (
  pipelines: Pipeline[],
  setPipelines: React.Dispatch<React.SetStateAction<Pipeline[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const deletePipeline = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("crm_pipelines")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPipelines(prevPipelines => prevPipelines.filter(pipeline => pipeline.id !== id));
      toast.success("Pipeline excluído com sucesso");
    } catch (err) {
      console.error("Erro ao excluir pipeline:", err);
      toast.error("Erro ao excluir pipeline");
    } finally {
      setIsLoading(false);
    }
  };

  const duplicatePipeline = async (id: string) => {
    setIsLoading(true);
    try {
      // Encontrar o pipeline que será duplicado
      const originalPipeline = pipelines.find(pipeline => pipeline.id === id);
      
      if (!originalPipeline) {
        throw new Error("Pipeline não encontrado");
      }

      // Criar um novo pipeline com base no original
      const { data: newPipeline, error } = await supabase
        .from("crm_pipelines")
        .insert({
          name: `${originalPipeline.name} (cópia)`,
          description: originalPipeline.description,
          is_active: false // Começar como inativo
        })
        .select()
        .single();

      if (error) throw error;
      if (!newPipeline) throw new Error("Falha ao criar o novo pipeline");

      // Duplicar estágios do pipeline
      const { data: stages, error: stagesError } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", id);

      if (stagesError) throw stagesError;

      if (stages && stages.length > 0) {
        // Definir tipo explicitamente
        interface StageInsert {
          name: string;
          color: string;
          pipeline_id: string;
          order: number;
        }

        const newStages: StageInsert[] = stages.map((stage: any) => ({
          name: stage.name,
          color: stage.color,
          pipeline_id: newPipeline.id,
          order: stage.order
        }));

        await supabase.from("crm_stages").insert(newStages);
      }

      // Duplicar campos do pipeline
      const { data: fields, error: fieldsError } = await supabase
        .from("crm_fields")
        .select("*")
        .eq("pipeline_id", id);

      if (fieldsError) throw fieldsError;

      if (fields && fields.length > 0) {
        // Definir tipo explicitamente
        interface FieldInsert {
          name: string;
          label: string;
          type: string;
          required: boolean;
          display_in_kanban: boolean;
          options?: string[] | null;
          mask?: string | null;
          default_value?: string | null;
          pipeline_id: string;
        }

        const newFields: FieldInsert[] = fields.map((field: any) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required,
          display_in_kanban: field.display_in_kanban,
          options: field.options,
          mask: field.mask,
          default_value: field.default_value,
          pipeline_id: newPipeline.id
        }));

        await supabase.from("crm_fields").insert(newFields);
      }

      // Atualizar a lista de pipelines com o novo pipeline
      setPipelines(prevPipelines => [...prevPipelines, newPipeline as Pipeline]);
      toast.success("Pipeline duplicado com sucesso");
    } catch (err) {
      console.error("Erro ao duplicar pipeline:", err);
      toast.error("Erro ao duplicar pipeline");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deletePipeline,
    duplicatePipeline
  };
};
