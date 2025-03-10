
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShippingRate } from "../types";

export const useImportShippingRates = (rates: Omit<ShippingRate, 'id'>[]) => {
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const importRates = async () => {
    if (isImporting || !rates.length) return;
    
    try {
      setIsImporting(true);
      console.log(`Iniciando importação de ${rates.length} taxas de frete`);
      
      const { error } = await supabase
        .from("shipping_rates")
        .upsert(rates, {
          onConflict: 'state,service_type,region_type'
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Tabela de fretes importada com sucesso!");
      
    } catch (error: any) {
      console.error("Erro ao importar taxas de frete:", error);
      toast.error("Erro ao importar taxas de frete. Tente novamente.");
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importRates
  };
};
