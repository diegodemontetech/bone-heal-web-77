
// Importar a função que fizemos
import { stringifyForSupabase } from "@/utils/supabaseJsonUtils";

// Na função createFlow, devemos ajustar:
const createFlow = async (flow: Omit<AutomationFlow, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase
      .from('automation_flows')
      .insert({
        name: flow.name,
        description: flow.description,
        is_active: flow.is_active || false,
        nodes: stringifyForSupabase(flow.nodes || []),
        edges: stringifyForSupabase(flow.edges || [])
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Atualizar o estado
    setFlows(prev => [...prev, data]);
    
    return data;
  } catch (error) {
    console.error("Erro ao criar fluxo:", error);
    toast.error("Erro ao criar fluxo");
    return null;
  }
};
