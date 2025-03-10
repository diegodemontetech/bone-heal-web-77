
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShippingRate } from "../types";

export const useShippingRates = () => {
  const { 
    data: shippingRates, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      console.log("Buscando taxas de frete...");
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("state", { ascending: true })
        .order("region_type", { ascending: true })
        .order("service_type", { ascending: true });

      if (error) {
        console.error("Erro ao buscar taxas:", error);
        throw error;
      }
      console.log("Taxas encontradas:", data?.length || 0);
      return data as ShippingRate[];
    },
  });

  // Se encontrar um erro na busca das taxas, exibir no console
  useEffect(() => {
    if (isError && error) {
      console.error("Erro na query de taxas de frete:", error);
    }
  }, [isError, error]);

  return {
    shippingRates,
    isLoading,
    isError,
    error,
    refetch
  };
};
