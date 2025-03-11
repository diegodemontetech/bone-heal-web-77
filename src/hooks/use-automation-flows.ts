
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Flow {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const useAutomationFlows = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFlows = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_flows")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setFlows(data || []);
    } catch (error) {
      console.error("Erro ao buscar fluxos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fluxos de trabalho",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const createFlow = async (name: string, description: string) => {
    try {
      if (!name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "Nome do fluxo é obrigatório",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from("automation_flows")
        .insert({
          name,
          description,
          nodes: [],
          edges: [],
          is_active: false,
        })
        .select("*")
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho criado com sucesso",
      });

      setFlows([data, ...flows]);
      return data;
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o fluxo de trabalho",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteFlow = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este fluxo de trabalho?")) return false;

    try {
      const { error } = await supabase
        .from("automation_flows")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho excluído com sucesso",
      });

      setFlows(flows.filter(flow => flow.id !== id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o fluxo de trabalho",
        variant: "destructive",
      });
      return false;
    }
  };

  const duplicateFlow = async (flowToDuplicate: Flow) => {
    try {
      // Fetch the flow data first
      const { data: flowData, error: fetchError } = await supabase
        .from("automation_flows")
        .select("*")
        .eq("id", flowToDuplicate.id)
        .single();

      if (fetchError) throw fetchError;

      // Insert a new flow with the same data
      const { data: newFlowData, error: insertError } = await supabase
        .from("automation_flows")
        .insert({
          name: `${flowToDuplicate.name} (Cópia)`,
          description: flowToDuplicate.description,
          nodes: flowData.nodes,
          edges: flowData.edges,
          is_active: false,
        })
        .select("*")
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho duplicado com sucesso",
      });

      setFlows([newFlowData, ...flows]);
      return newFlowData;
    } catch (error) {
      console.error("Erro ao duplicar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o fluxo de trabalho",
        variant: "destructive",
      });
      return null;
    }
  };

  const toggleFlowStatus = async (flow: Flow) => {
    try {
      const { error } = await supabase
        .from("automation_flows")
        .update({ is_active: !flow.is_active })
        .eq("id", flow.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Fluxo ${flow.is_active ? "desativado" : "ativado"} com sucesso`,
      });

      setFlows(
        flows.map(f => 
          f.id === flow.id ? { ...f, is_active: !f.is_active } : f
        )
      );
      return true;
    } catch (error) {
      console.error("Erro ao alterar status do fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do fluxo",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    flows,
    loading,
    fetchFlows,
    createFlow,
    deleteFlow,
    duplicateFlow,
    toggleFlowStatus
  };
};
