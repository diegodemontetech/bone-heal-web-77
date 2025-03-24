
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShippingRate } from "@/components/admin/shipping/types";
import { useAuthContext } from "@/hooks/auth/auth-context";

export const useShippingRates = () => {
  const { session } = useAuthContext();
  
  const { 
    data: shippingRates, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("shipping_rates")
          .select("*")
          .order("state", { ascending: true })
          .order("region_type", { ascending: true })
          .order("service_type", { ascending: true });

        if (error) throw error;
        return data as ShippingRate[];
      } catch (err: any) {
        console.error("Erro ao buscar taxas de frete:", err);
        toast.error("Erro ao carregar taxas de frete");
        throw err;
      }
    },
    enabled: Boolean(session)
  });

  return {
    shippingRates,
    isLoading,
    isError,
    error,
    refetch
  };
};
