
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { parseJsonArray, stringifyForSupabase } from '@/utils/supabaseJsonUtils';

export const useFlowActions = (
  flows: AutomationFlow[],
  setFlows: React.Dispatch<React.SetStateAction<AutomationFlow[]>>
) => {
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
    duplicateFlow,
    deleteFlow,
    toggleFlowStatus
  };
};
