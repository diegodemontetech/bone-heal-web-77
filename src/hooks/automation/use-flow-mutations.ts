
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { stringifyForSupabase, parseJsonArray } from '@/utils/supabaseJsonUtils';

/**
 * Interface para opções de criação de fluxo
 */
interface FlowCreateOptions {
  department_id?: string;
  responsible_id?: string;
  has_attachment?: boolean;
}

/**
 * Hook para gerenciar mutações de fluxos de automação
 */
export const useFlowMutations = (
  flows: AutomationFlow[],
  setFlows: React.Dispatch<React.SetStateAction<AutomationFlow[]>>
) => {
  /**
   * Prepara um objeto de fluxo para armazenamento no Supabase
   */
  const prepareFlowForStorage = (
    name: string, 
    description: string, 
    options?: FlowCreateOptions
  ) => {
    return {
      name,
      description,
      is_active: true,
      nodes: stringifyForSupabase([]),
      edges: stringifyForSupabase([]),
      department_id: options?.department_id || null,
      responsible_id: options?.responsible_id || null,
      has_attachment: options?.has_attachment || false
    };
  };

  /**
   * Atualiza o estado local dos fluxos após uma criação bem-sucedida
   */
  const updateStateAfterCreate = (data: any) => {
    setFlows(prev => [
      {
        ...data,
        nodes: [],
        edges: []
      },
      ...prev
    ]);
  };

  /**
   * Prepara atualizações de fluxo para armazenamento no Supabase
   */
  const prepareFlowUpdates = (updates: Partial<AutomationFlow>) => {
    const dataToUpdate: Record<string, any> = { ...updates };
    
    if (updates.nodes) {
      dataToUpdate.nodes = stringifyForSupabase(updates.nodes);
    }
    
    if (updates.edges) {
      dataToUpdate.edges = stringifyForSupabase(updates.edges);
    }
    
    return dataToUpdate;
  };

  /**
   * Atualiza o estado local dos fluxos após uma atualização bem-sucedida
   */
  const updateStateAfterUpdate = (id: string, data: any) => {
    setFlows(prev => prev.map(flow => 
      flow.id === id ? {
        ...flow,
        ...data,
        nodes: data.nodes ? parseJsonArray(data.nodes, []) : flow.nodes,
        edges: data.edges ? parseJsonArray(data.edges, []) : flow.edges
      } : flow
    ));
  };

  /**
   * Cria um novo fluxo com os campos fornecidos
   */
  const createFlow = async (
    name: string, 
    description: string, 
    options?: FlowCreateOptions
  ) => {
    try {
      console.log('Criando novo fluxo:', { name, description, options });
      
      const newFlow = prepareFlowForStorage(name, description, options);
      
      const { data, error } = await supabase
        .from('automation_flows')
        .insert(newFlow)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Fluxo criado:', data);
      
      updateStateAfterCreate(data);
      
      toast.success('Pipeline criado com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao criar pipeline:', err);
      toast.error('Erro ao criar pipeline');
      throw err;
    }
  };
  
  /**
   * Atualiza um fluxo existente com as alterações fornecidas
   */
  const updateFlow = async (id: string, updates: Partial<AutomationFlow>) => {
    try {
      const dataToUpdate = prepareFlowUpdates(updates);
      
      const { data, error } = await supabase
        .from('automation_flows')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      updateStateAfterUpdate(id, data);
      
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
