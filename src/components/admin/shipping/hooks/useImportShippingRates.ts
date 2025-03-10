
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
      
      // Log detalhado dos dados para diagnóstico
      console.log("Estrutura dos dados para importação:", 
        rates.slice(0, 2).map(rate => ({
          state: rate.state,
          region_type: rate.region_type,
          service_type: rate.service_type,
          rate: rate.rate,
          delivery_days: rate.delivery_days
        }))
      );
      
      // Verificar se há valores inválidos nos dados
      const validRates = rates.filter(rate => 
        rate.state && 
        rate.region_type && 
        rate.service_type && 
        typeof rate.rate === 'number' && 
        typeof rate.delivery_days === 'number'
      );
      
      if (validRates.length !== rates.length) {
        console.warn(`Atenção: ${rates.length - validRates.length} taxas de frete possuem dados inválidos e foram filtradas`);
      }
      
      // Limpar registros existentes antes de importar novos
      const { error: deleteError } = await supabase
        .from("shipping_rates")
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
        
      if (deleteError) {
        console.error("Erro ao limpar taxas de frete existentes:", deleteError);
        toast.error("Erro ao preparar importação. Tente novamente.");
        throw deleteError;
      }
      
      console.log("Tabela limpa com sucesso, inserindo novas taxas...");
      
      // Inserir novas taxas
      const { data, error } = await supabase
        .from("shipping_rates")
        .insert(validRates)
        .select();

      if (error) {
        console.error("Erro ao importar taxas de frete:", error);
        console.error("Detalhes do erro:", error.details, error.hint, error.message);
        toast.error("Erro ao importar taxas de frete. Tente novamente.");
        throw error;
      }

      console.log("Importação concluída com sucesso! Registros inseridos:", data?.length || 0);
      
      // Invalidar a consulta para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success(`${validRates.length} taxas de frete importadas com sucesso!`);
      
    } catch (error: any) {
      console.error("Erro ao importar taxas de frete:", error);
      if (error.code) {
        console.error(`Código do erro: ${error.code}, Detalhes: ${error.details || error.message}`);
      }
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
