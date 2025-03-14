
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { parseJsonArray, stringifyForSupabase } from '@/utils/supabaseJsonUtils';

export const useAutomationFlows = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchFlows = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('automation_flows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
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
  
  // Função para criar um novo fluxo
  const createFlow = async (name: string, description: string) => {
    try {
      const newFlow = {
        name,
        description,
        is_active: true,
        nodes: stringifyForSupabase([]),
        edges: stringifyForSupabase([])
      };
      
      const { data, error } = await supabase
        .from('automation_flows')
        .insert(newFlow)
        .select()
        .single();
      
      if (error) throw error;
      
      // Adicionar o novo fluxo ao estado
      setFlows(prev => [
        {
          ...data,
          nodes: [],
          edges: []
        },
        ...prev
      ]);
      
      toast.success('Fluxo criado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao criar fluxo:', err);
      toast.error('Erro ao criar fluxo');
      throw err;
    }
  };
  
  // Função para atualizar um fluxo
  const updateFlow = async (id: string, updates: Partial<AutomationFlow>) => {
    try {
      // Verificar se nodes ou edges precisam ser convertidos para JSON
      const dataToUpdate: Record<string, any> = { ...updates };
      
      if (updates.nodes) {
        dataToUpdate.nodes = stringifyForSupabase(updates.nodes);
      }
      
      if (updates.edges) {
        dataToUpdate.edges = stringifyForSupabase(updates.edges);
      }
      
      const { data, error } = await supabase
        .from('automation_flows')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar o fluxo no estado
      setFlows(prev => prev.map(flow => 
        flow.id === id ? {
          ...flow,
          ...data,
          nodes: data.nodes ? parseJsonArray(data.nodes, []) : flow.nodes,
          edges: data.edges ? parseJsonArray(data.edges, []) : flow.edges
        } : flow
      ));
      
      toast.success('Fluxo atualizado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao atualizar fluxo:', err);
      toast.error('Erro ao atualizar fluxo');
      throw err;
    }
  };
  
  // Função para duplicar um fluxo
  const duplicateFlow = async (id: string) => {
    try {
      // Encontrar o fluxo a ser duplicado
      const flowToDuplicate = flows.find(flow => flow.id === id);
      
      if (!flowToDuplicate) {
        throw new Error('Fluxo não encontrado');
      }
      
      // Criar um novo fluxo baseado no existente
      const { data, error } = await supabase
        .from('automation_flows')
        .insert({
          name: `${flowToDuplicate.name} (cópia)`,
          description: flowToDuplicate.description,
          is_active: false, // Começar como inativo
          nodes: stringifyForSupabase(flowToDuplicate.nodes),
          edges: stringifyForSupabase(flowToDuplicate.edges)
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Adicionar o fluxo duplicado ao estado
      setFlows(prev => [
        {
          ...data,
          nodes: parseJsonArray(data.nodes, []),
          edges: parseJsonArray(data.edges, [])
        },
        ...prev
      ]);
      
      toast.success('Fluxo duplicado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao duplicar fluxo:', err);
      toast.error('Erro ao duplicar fluxo');
      return null;
    }
  };
  
  // Função para excluir um fluxo
  const deleteFlow = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_flows')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remover o fluxo do estado
      setFlows(prev => prev.filter(flow => flow.id !== id));
      
      toast.success('Fluxo excluído com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao excluir fluxo:', err);
      toast.error('Erro ao excluir fluxo');
      return false;
    }
  };
  
  // Função para alternar o status de um fluxo
  const toggleFlowStatus = async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('automation_flows')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar o fluxo no estado
      setFlows(prev => prev.map(flow => 
        flow.id === id ? { ...flow, is_active: isActive } : flow
      ));
      
      toast.success(`Fluxo ${isActive ? 'ativado' : 'desativado'} com sucesso`);
      return data;
    } catch (err) {
      console.error('Erro ao alterar status do fluxo:', err);
      toast.error('Erro ao alterar status do fluxo');
      return null;
    }
  };
  
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
