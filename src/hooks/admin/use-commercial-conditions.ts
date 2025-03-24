
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommercialCondition } from "@/types/commercial-conditions";

export const useCommercialConditions = () => {
  const [conditions, setConditions] = useState<CommercialCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("commercial_conditions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setConditions(data as CommercialCondition[]);
    } catch (err) {
      console.error("Erro ao buscar condições comerciais:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Erro ao carregar condições comerciais");
    } finally {
      setLoading(false);
    }
  };

  const deleteCondition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('commercial_conditions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Condição comercial excluída com sucesso!");
      await fetchConditions();
    } catch (error: any) {
      console.error("Erro ao excluir condição comercial:", error);
      toast.error("Erro ao excluir condição comercial");
    }
  };
  
  const toggleConditionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('commercial_conditions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Condição ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`);
      await fetchConditions();
    } catch (error: any) {
      console.error("Erro ao alterar status da condição:", error);
      toast.error("Erro ao alterar status da condição");
    }
  };

  return {
    conditions,
    loading,
    error,
    fetchConditions,
    deleteCondition,
    toggleConditionStatus
  };
};
