
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AutomationFlow {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  nodes: any[];
  edges: any[];
  is_active: boolean;
}

export const useAutomationFlows = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("automation_flows")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFlows(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar fluxos de automação:", err);
      setError(err);
      toast.error("Erro ao carregar fluxos de automação");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const createFlow = async (name: string, description: string) => {
    try {
      // Certifique-se de que os campos estão preenchidos
      if (!name.trim()) {
        throw new Error("O nome do fluxo é obrigatório");
      }

      // Cria um novo fluxo com valores iniciais
      const { data, error } = await supabase
        .from("automation_flows")
        .insert([
          {
            name,
            description: description || null,
            nodes: [],
            edges: [],
            is_active: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar fluxo:", error);
        throw error;
      }

      // Atualiza a lista de fluxos no state
      setFlows((prev) => [data, ...prev]);
      toast.success("Fluxo criado com sucesso!");
      return data;
    } catch (err: any) {
      console.error("Erro ao criar fluxo:", err);
      toast.error(`Erro ao criar fluxo: ${err.message}`);
      throw err;
    }
  };

  const deleteFlow = async (id: string) => {
    try {
      const { error } = await supabase
        .from("automation_flows")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFlows((prev) => prev.filter((flow) => flow.id !== id));
      toast.success("Fluxo excluído com sucesso!");
    } catch (err: any) {
      console.error("Erro ao excluir fluxo:", err);
      toast.error("Erro ao excluir fluxo");
    }
  };

  const duplicateFlow = async (id: string) => {
    try {
      // Busca o fluxo a ser duplicado
      const { data: flowToDuplicate, error: fetchError } = await supabase
        .from("automation_flows")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!flowToDuplicate) throw new Error("Fluxo não encontrado");

      // Cria novo fluxo com os mesmos dados
      const { data: duplicatedFlow, error: insertError } = await supabase
        .from("automation_flows")
        .insert([
          {
            name: `${flowToDuplicate.name} (cópia)`,
            description: flowToDuplicate.description,
            nodes: flowToDuplicate.nodes,
            edges: flowToDuplicate.edges,
            is_active: false // Sempre cria desativado
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Atualiza a lista de fluxos
      setFlows((prev) => [duplicatedFlow, ...prev]);
      toast.success("Fluxo duplicado com sucesso!");
      return duplicatedFlow;
    } catch (err: any) {
      console.error("Erro ao duplicar fluxo:", err);
      toast.error("Erro ao duplicar fluxo");
      return null;
    }
  };

  const toggleFlowStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      const { error } = await supabase
        .from("automation_flows")
        .update({ is_active: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Atualiza a lista de fluxos
      setFlows((prev) =>
        prev.map((flow) =>
          flow.id === id ? { ...flow, is_active: newStatus } : flow
        )
      );

      toast.success(
        `Fluxo ${newStatus ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (err: any) {
      console.error("Erro ao atualizar status do fluxo:", err);
      toast.error("Erro ao atualizar status do fluxo");
    }
  };

  return {
    flows,
    loading,
    error,
    createFlow,
    deleteFlow,
    duplicateFlow,
    toggleFlowStatus,
    refreshFlows: fetchFlows
  };
};
