
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { parseJsonArray, stringifyForSupabase } from '@/utils/supabaseJsonUtils';

interface FlowCreateOptions {
  department_id?: string;
  responsible_id?: string;
  has_attachment?: boolean;
}

export const useAutomationFlows = () => {
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
  
  // Função para criar um novo fluxo com campos adicionais
  const createFlow = async (name: string, description: string, options?: FlowCreateOptions) => {
    try {
      console.log('Criando novo fluxo:', { name, description, options });
      
      const newFlow = {
        name,
        description,
        is_active: true,
        nodes: stringifyForSupabase([]),
        edges: stringifyForSupabase([]),
        department_id: options?.department_id || null,
        responsible_id: options?.responsible_id || null,
        has_attachment: options?.has_attachment || false
      };
      
      const { data, error } = await supabase
        .from('automation_flows')
        .insert(newFlow)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Fluxo criado:', data);
      
      // Adicionar o novo fluxo ao estado
      setFlows(prev => [
        {
          ...data,
          nodes: [],
          edges: []
        },
        ...prev
      ]);
      
      toast.success('Pipeline criado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao criar pipeline:', err);
      toast.error('Erro ao criar pipeline');
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
      
      toast.success('Pipeline atualizado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao atualizar pipeline:', err);
      toast.error('Erro ao atualizar pipeline');
      throw err;
    }
  };
  
  // Função para duplicar um fluxo
  const duplicateFlow = async (id: string) => {
    try {
      // Encontrar o fluxo a ser duplicado
      const flowToDuplicate = flows.find(flow => flow.id === id);
      
      if (!flowToDuplicate) {
        throw new Error('Pipeline não encontrado');
      }
      
      // Criar um novo fluxo baseado no existente
      const { data, error } = await supabase
        .from('automation_flows')
        .insert({
          name: `${flowToDuplicate.name} (cópia)`,
          description: flowToDuplicate.description,
          is_active: false, // Começar como inativo
          nodes: stringifyForSupabase(flowToDuplicate.nodes),
          edges: stringifyForSupabase(flowToDuplicate.edges),
          department_id: flowToDuplicate.department_id,
          responsible_id: flowToDuplicate.responsible_id,
          has_attachment: flowToDuplicate.has_attachment
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
      
      toast.success('Pipeline duplicado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao duplicar pipeline:', err);
      toast.error('Erro ao duplicar pipeline');
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
      
      toast.success('Pipeline excluído com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao excluir pipeline:', err);
      toast.error('Erro ao excluir pipeline');
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
      
      toast.success(`Pipeline ${isActive ? 'ativado' : 'desativado'} com sucesso`);
      return data;
    } catch (err) {
      console.error('Erro ao alterar status do pipeline:', err);
      toast.error('Erro ao alterar status do pipeline');
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
