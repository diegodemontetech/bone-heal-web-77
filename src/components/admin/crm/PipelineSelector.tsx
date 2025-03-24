
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pipeline } from "@/types/crm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PipelineSelectorProps {
  selectedPipeline: string | null;
  onPipelineChange: (pipelineId: string | null) => void;
}

export const PipelineSelector = ({
  selectedPipeline,
  onPipelineChange
}: PipelineSelectorProps) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("crm_pipelines")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      // Mapear para o formato Pipeline e aplicar cor padrão se não tiver
      const mappedPipelines: Pipeline[] = data.map(pipeline => ({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        color: pipeline.color || "#3b82f6",
        is_active: pipeline.is_active,
        created_at: pipeline.created_at,
        updated_at: pipeline.updated_at,
        form_url: pipeline.form_url,
        department_id: pipeline.department_id
      }));

      setPipelines(mappedPipelines);

      // Se não houver pipeline selecionado e tiver pipelines disponíveis, seleciona o primeiro
      if (!selectedPipeline && mappedPipelines.length > 0) {
        onPipelineChange(mappedPipelines[0].id);
      }
    } catch (error) {
      console.error("Erro ao buscar pipelines:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64">
      <Select
        value={selectedPipeline || ""}
        onValueChange={(value) => onPipelineChange(value === "" ? null : value)}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um pipeline" />
        </SelectTrigger>
        <SelectContent>
          {pipelines.map((pipeline) => (
            <SelectItem 
              key={pipeline.id} 
              value={pipeline.id}
            >
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: pipeline.color }}
                ></span>
                {pipeline.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
