
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useShippingRatesData = () => {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("region", { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (err) {
      console.error("Erro ao buscar taxas de envio:", err);
      toast.error("Erro ao carregar taxas de envio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    fetchRates,
    setRates
  };
};
