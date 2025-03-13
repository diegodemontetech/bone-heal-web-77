
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { stringifyForSupabase, parseJsonArray } from '@/utils/supabaseJsonUtils';

interface FlowCreateOptions {
  department_id?: string;
  responsible_id?: string;
  has_attachment?: boolean;
}

export const useFlowMutations = (
  flows: AutomationFlow[],
  setFlows: React.Dispatch<React.SetStateAction<AutomationFlow[]>>
) => {
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

  return {
    createFlow,
    updateFlow
  };
};
