
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Pipeline } from "@/types/crm";

interface PipelineSelectorProps {
  selectedPipeline: string | null;
  onPipelineChange: (pipelineId: string | null) => void;
}

export const PipelineSelector = ({ selectedPipeline, onPipelineChange }: PipelineSelectorProps) => {
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
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;

      // Mapear dados para garantir que todos os campos necessários estejam presentes
      const mappedPipelines: Pipeline[] = (data || []).map(pipeline => ({
        ...pipeline,
        color: pipeline.color || '#3b82f6', // Usar cor padrão se não estiver definida
        id: pipeline.id,
        name: pipeline.name
      }));
      
      setPipelines(mappedPipelines);

      // Se não houver pipeline selecionado e temos pipelines, selecionar o primeiro
      if (!selectedPipeline && mappedPipelines.length > 0) {
        onPipelineChange(mappedPipelines[0].id);
      }
    } catch (error) {
      console.error("Erro ao buscar pipelines:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Carregando pipelines...</span>
      </div>
    );
  }

  if (pipelines.length === 0) {
    return (
      <div className="flex items-center h-10 px-3 border rounded-md bg-muted/20">
        <span className="text-sm text-muted-foreground">Nenhum pipeline encontrado</span>
      </div>
    );
  }

  return (
    <Select value={selectedPipeline || undefined} onValueChange={onPipelineChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione um pipeline" />
      </SelectTrigger>
      <SelectContent>
        {pipelines.map((pipeline) => (
          <SelectItem key={pipeline.id} value={pipeline.id}>
            {pipeline.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
