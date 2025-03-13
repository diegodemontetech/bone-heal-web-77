
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { parseJsonArray } from '@/utils/supabaseJsonUtils';

export const useFlowsQuery = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchFlows = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Buscando fluxos de automação...');
      const { data, error } = await supabase
        .from('automation_flows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fluxos recuperados:', data);
      
      // Converter os nós e bordas de JSON para objetos
      const formattedFlows = data.map(flow => ({
        ...flow,
        nodes: parseJsonArray(flow.nodes, []),
        edges: parseJsonArray(flow.edges, [])
      }));
      
      setFlows(formattedFlows);
    } catch (err) {
      console.error('Erro ao buscar fluxos:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Erro ao carregar fluxos');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  return {
    flows,
    isLoading,
    error,
    fetchFlows,
    setFlows
  };
};
