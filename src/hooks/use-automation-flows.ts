import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Node, Edge } from 'reactflow';
import { Json } from "@/integrations/supabase/types";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";

export interface AutomationFlow {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  is_active: boolean;
  nodes: any[];
  edges: any[];
}

export const useAutomationFlows = () => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchFlows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_flows")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar fluxos de automação:", error);
        setError(error);
        toast({
          title: "Erro ao buscar fluxos de automação",
          description: "Ocorreu um erro ao carregar os fluxos de automação.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const processedFlows = data.map(flow => ({
          ...flow,
          nodes: parseJsonArray(flow.nodes, []),
          edges: parseJsonArray(flow.edges, [])
        }));
        setFlows(processedFlows);
      }
    } catch (err: any) {
      console.error("Erro inesperado ao buscar fluxos:", err);
      setError(err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado ao carregar os fluxos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const createFlow = async (flow: Omit<AutomationFlow, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_flows")
        .insert([flow])
        .select();

      if (error) {
        console.error("Erro ao criar fluxo de automação:", error);
        toast({
          title: "Erro ao criar fluxo",
          description: "Ocorreu um erro ao criar o fluxo de automação.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        setFlows((prev) => [...prev, data[0] as AutomationFlow]);
        toast({
          title: "Fluxo criado",
          description: "Fluxo de automação criado com sucesso!",
        });
      }
    } catch (err: any) {
      console.error("Erro ao criar fluxo:", err);
      toast({
        title: "Erro",
        description: `Ocorreu um erro: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFlow = async (id: string, updates: Partial<AutomationFlow>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_flows")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Erro ao atualizar fluxo de automação:", error);
        toast({
          title: "Erro ao atualizar fluxo",
          description: "Ocorreu um erro ao atualizar o fluxo de automação.",
          variant: "destructive",
        });
        return;
      }

      setFlows((prev) =>
        prev.map((flow) => (flow.id === id ? { ...flow, ...updates } : flow))
      );
      toast({
        title: "Fluxo atualizado",
        description: "Fluxo de automação atualizado com sucesso!",
      });
    } catch (err: any) {
      console.error("Erro ao atualizar fluxo:", err);
      toast({
        title: "Erro",
        description: `Ocorreu um erro: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFlow = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("automation_flows")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao excluir fluxo de automação:", error);
        toast({
          title: "Erro ao excluir fluxo",
          description: "Ocorreu um erro ao excluir o fluxo de automação.",
          variant: "destructive",
        });
        return;
      }

      setFlows((prev) => prev.filter((flow) => flow.id !== id));
      toast({
        title: "Fluxo excluído",
        description: "Fluxo de automação excluído com sucesso!",
      });
    } catch (err: any) {
      console.error("Erro ao excluir fluxo:", err);
      toast({
        title: "Erro",
        description: `Ocorreu um erro: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
  };
};
