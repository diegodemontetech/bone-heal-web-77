
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
      
      // Log para verificar os dados que estão sendo enviados
      console.log("Amostra de dados para importação:", rates.slice(0, 2));
      
      const { data, error } = await supabase
        .from("shipping_rates")
        .upsert(rates, {
          onConflict: 'state,service_type,region_type',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Erro ao importar taxas de frete:", error);
        toast.error("Erro ao importar taxas de frete. Tente novamente.");
        throw error;
      }

      console.log("Importação concluída com sucesso!");
      
      // Invalidar a consulta para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success(`${rates.length} taxas de frete importadas com sucesso!`);
      
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
