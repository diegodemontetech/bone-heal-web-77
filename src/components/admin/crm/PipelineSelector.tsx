
import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Pipeline {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface PipelineSelectorProps {
  selectedPipeline: string | null;
  onPipelineChange: (pipelineId: string) => void;
}

export const PipelineSelector = ({ selectedPipeline, onPipelineChange }: PipelineSelectorProps) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crm_pipelines')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setPipelines(data || []);
        
        // Se não há pipeline selecionado e temos dados, seleciona o primeiro
        if (!selectedPipeline && data && data.length > 0) {
          onPipelineChange(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar pipelines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelines();
  }, []);

  if (loading) {
    return (
      <div className="w-[200px] h-10 bg-gray-200 animate-pulse rounded-md"></div>
    );
  }

  return (
    <Select 
      value={selectedPipeline || undefined} 
      onValueChange={onPipelineChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione um pipeline" />
      </SelectTrigger>
      <SelectContent>
        {pipelines.map((pipeline) => (
          <SelectItem 
            key={pipeline.id} 
            value={pipeline.id}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: pipeline.color }}
              ></div>
              <span>{pipeline.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
