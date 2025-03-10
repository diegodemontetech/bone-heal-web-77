
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
      
      // Validar dados antes da importação
      const validRates = rates.filter(rate => {
        const isValid = rate.state && 
                       rate.region_type && 
                       rate.service_type && 
                       typeof rate.rate === 'number' && 
                       typeof rate.delivery_days === 'number';
                       
        if (!isValid) {
          console.warn("Taxa de frete inválida detectada:", rate);
        }
        
        return isValid;
      });
      
      console.log(`Taxas válidas para importação: ${validRates.length}/${rates.length}`);
      
      if (validRates.length === 0) {
        throw new Error("Nenhuma taxa de frete válida para importação");
      }
      
      // Limpar registros existentes antes de importar novos
      console.log("Tentando limpar tabela de fretes existentes...");
      const { error: deleteError } = await supabase
        .from("shipping_rates")
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
        
      if (deleteError) {
        console.error("Erro ao limpar taxas de frete existentes:", deleteError);
        console.error("Detalhes adicionais:", deleteError.details, deleteError.message, deleteError.code);
        throw new Error(`Erro ao limpar tabela: ${deleteError.message}`);
      }
      
      console.log("Tabela limpa com sucesso, inserindo novas taxas...");
      
      // Inserir novas taxas em lotes menores (50 por vez)
      const batchSize = 50;
      let successCount = 0;
      
      for (let i = 0; i < validRates.length; i += batchSize) {
        const batch = validRates.slice(i, i + batchSize);
        console.log(`Importando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(validRates.length/batchSize)}, ${batch.length} taxas`);
        
        const { data, error } = await supabase
          .from("shipping_rates")
          .insert(batch)
          .select();

        if (error) {
          console.error(`Erro ao importar lote ${i/batchSize + 1}:`, error);
          console.error("Detalhes do erro:", error.details, error.hint, error.message, error.code);
          throw new Error(`Erro ao importar taxas: ${error.message}`);
        }
        
        successCount += (data?.length || 0);
        console.log(`Lote ${Math.floor(i/batchSize) + 1} importado com sucesso: ${data?.length || 0} registros`);
      }

      console.log(`Importação concluída: ${successCount} taxas de frete inseridas`);
      
      // Invalidar a consulta para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success(`${successCount} taxas de frete importadas com sucesso!`);
      
    } catch (error: any) {
      console.error("Erro ao importar taxas de frete:", error);
      
      // Logar detalhes mais específicos do erro
      if (error.code) {
        console.error(`Código do erro: ${error.code}`);
      }
      if (error.details) {
        console.error(`Detalhes do erro: ${error.details}`);
      }
      
      // Mensagem de erro mais informativa
      const errorMessage = error.message || "Erro ao importar taxas de frete";
      toast.error(`Erro: ${errorMessage}. Verifique o console para mais detalhes.`);
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importRates
  };
};
