
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AutomationFlow } from './use-automation-flow';
import { parseJsonArray } from "@/utils/supabaseJsonUtils";

export const useAutomationFlows = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('automation_flows')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      // Converter dados JSON para objetos
      const processedFlows = data.map(flow => ({
        ...flow,
        nodes: parseJsonArray(flow.nodes),
        edges: parseJsonArray(flow.edges)
      }));
      
      setFlows(processedFlows as AutomationFlow[]);
    } catch (err) {
      console.error("Erro ao buscar fluxos:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Falha ao carregar fluxos de automação");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFlow = useCallback(async (name: string, description: string) => {
    try {
      const newFlow = {
        name,
        description,
        is_active: true,
        nodes: [],
        edges: []
      };
      
      const { data, error } = await supabase
        .from('automation_flows')
        .insert([newFlow])
        .select()
        .single();
        
      if (error) throw error;
      
      setFlows(prev => [
        {
          ...data,
          nodes: [],
          edges: []
        } as AutomationFlow,
        ...prev
      ]);
      
      toast.success("Fluxo criado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao criar fluxo:", err);
      toast.error("Falha ao criar fluxo de automação");
      throw err;
    }
  }, []);

  const updateFlow = useCallback(async (id: string, updates: Partial<AutomationFlow>) => {
    try {
      const { data, error } = await supabase
        .from('automation_flows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setFlows(prev => prev.map(flow => 
        flow.id === id ? { 
          ...flow, 
          ...data,
          nodes: parseJsonArray(data.nodes, flow.nodes),
          edges: parseJsonArray(data.edges, flow.edges)
        } as AutomationFlow : flow
      ));
      
      toast.success("Fluxo atualizado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao atualizar fluxo:", err);
      toast.error("Falha ao atualizar fluxo de automação");
      throw err;
    }
  }, []);

  const deleteFlow = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_flows')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setFlows(prev => prev.filter(flow => flow.id !== id));
      toast.success("Fluxo excluído com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao excluir fluxo:", err);
      toast.error("Falha ao excluir fluxo de automação");
      return false;
    }
  }, []);

  const duplicateFlow = useCallback(async (id: string) => {
    try {
      // Primeiro obter o fluxo a ser duplicado
      const originalFlow = flows.find(f => f.id === id);
      if (!originalFlow) {
        throw new Error('Fluxo não encontrado');
      }
      
      // Criar novo fluxo com os mesmos dados
      const newFlow = {
        name: `${originalFlow.name} (cópia)`,
        description: originalFlow.description,
        is_active: originalFlow.is_active,
        nodes: originalFlow.nodes,
        edges: originalFlow.edges
      };
      
      const { data, error } = await supabase
        .from('automation_flows')
        .insert([newFlow])
        .select()
        .single();
        
      if (error) throw error;
      
      setFlows(prev => [
        {
          ...data,
          nodes: parseJsonArray(data.nodes, originalFlow.nodes),
          edges: parseJsonArray(data.edges, originalFlow.edges)
        } as AutomationFlow,
        ...prev
      ]);
      
      toast.success("Fluxo duplicado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao duplicar fluxo:", err);
      toast.error("Falha ao duplicar fluxo de automação");
      return null;
    }
  }, [flows]);

  const toggleFlowStatus = useCallback(async (id: string, isActive: boolean) => {
    return updateFlow(id, { is_active: !isActive });
  }, [updateFlow]);

  return {
    flows,
    isLoading,
    error,
    fetchFlows,
    createFlow,
    updateFlow,
    deleteFlow,
    duplicateFlow,
    toggleFlowStatus
  };
};
