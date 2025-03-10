
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
      console.log("Buscando taxas de frete do Supabase...");
      
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("state", { ascending: true })
        .order("region_type", { ascending: true })
        .order("service_type", { ascending: true });

      if (error) {
        console.error("Erro ao buscar taxas de frete:", error);
        toast.error("Erro ao carregar taxas de frete");
        throw error;
      }
      
      console.log(`Taxas de frete encontradas: ${data?.length || 0}`);
      if (data?.length) {
        console.log("Amostra de taxa:", data[0]);
      } else {
        console.log("Nenhuma taxa de frete encontrada no banco");
      }
      
      return data as ShippingRate[];
    },
  });

  // Monitorar quando os dados são carregados
  useEffect(() => {
    if (shippingRates) {
      console.log(`Taxas de frete carregadas: ${shippingRates.length}`);
    }
  }, [shippingRates]);

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
