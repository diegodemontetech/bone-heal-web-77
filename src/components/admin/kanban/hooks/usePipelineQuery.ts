
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pipeline, Stage } from "@/types/crm";

export const usePipelineQuery = (pipelineId: string | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pipeline", pipelineId],
    queryFn: async (): Promise<{ pipeline: Pipeline | null, stages: Stage[] }> => {
      if (!pipelineId) {
        return { pipeline: null, stages: [] };
      }

      try {
        // Fetch pipeline
        const { data: pipelineData, error: pipelineError } = await supabase
          .from("crm_pipelines")
          .select("*")
          .eq("id", pipelineId)
          .single();
          
        if (pipelineError) throw pipelineError;
        
        // Fetch stages for this pipeline
        const { data: stagesData, error: stagesError } = await supabase
          .from("crm_stages")
          .select("*")
          .eq("pipeline_id", pipelineId)
          .order("order_index", { ascending: true });
          
        if (stagesError) throw stagesError;
        
        return { 
          pipeline: pipelineData, 
          stages: stagesData || [] 
        };
      } catch (error) {
        console.error("Error fetching pipeline data:", error);
        throw error;
      }
    },
    enabled: !!pipelineId,
  });

  return { 
    pipeline: data?.pipeline || null,
    stages: data?.stages || [],
    isLoading, 
    error,
    refetch
  };
};
