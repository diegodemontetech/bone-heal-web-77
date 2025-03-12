
// Precisamos atualizar a função saveFlow para usar stringifyForSupabase
import { stringifyForSupabase } from "@/utils/supabaseJsonUtils";

// Na função saveFlow, devemos converter os nodes e edges para JSON
const saveFlow = async (flowData: Partial<AutomationFlow>) => {
  setIsSaving(true);
  
  try {
    // Converter os nodes e edges para JSON string antes de salvar
    const dataToSave = {
      ...flowData,
      nodes: stringifyForSupabase(flowData.nodes || []),
      edges: stringifyForSupabase(flowData.edges || [])
    };
    
    if (flowId) {
      // Atualizar fluxo existente
      const { error } = await supabase
        .from('automation_flows')
        .update({
          name: dataToSave.name || flowName,
          description: dataToSave.description,
          nodes: dataToSave.nodes,
          edges: dataToSave.edges,
          is_active: dataToSave.is_active
        })
        .eq('id', flowId);
        
      if (error) throw error;
      
      // Refresh dados
      fetchFlowData();
      toast.success("Fluxo atualizado com sucesso");
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar fluxo:", error);
    toast.error("Erro ao salvar fluxo");
    return false;
  } finally {
    setIsSaving(false);
  }
};
