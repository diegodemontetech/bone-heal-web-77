
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CommercialCondition {
  id: string;
  name: string;
  description?: string;
  discount_type: string;
  discount_value: number;
  min_purchase_value?: number;
  min_purchase_quantity?: number;
  valid_from?: string;
  valid_until?: string;
  payment_method?: string;
  region?: string;
  target_customer_group?: string;
  free_shipping: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
      
      // Mapear os dados do banco para o formato correto de CommercialCondition
      const mappedConditions = data.map(item => ({
        ...item,
        min_purchase_value: item.min_amount,
        min_purchase_quantity: item.min_items,
        target_customer_group: item.customer_group,
      })) as CommercialCondition[];
      
      setConditions(mappedConditions);
    } catch (err) {
      console.error("Erro ao buscar condições comerciais:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Erro ao carregar condições comerciais");
    } finally {
      setLoading(false);
    }
  };

  // Outros métodos CRUD aqui...

  return {
    conditions,
    loading,
    error,
    fetchConditions,
    // outros métodos...
  };
};
