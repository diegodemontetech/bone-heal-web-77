
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook para importar taxas de frete padrão
 * @param rates Array com as taxas de frete a serem importadas
 * @returns Funções e estados para gerenciar a importação
 */
export const useImportShippingRates = (rates: any[]) => {
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const importRates = async () => {
    if (isImporting || !rates.length) return;
    
    setIsImporting(true);
    console.log(`Iniciando importação de ${rates.length} taxas de frete`);
    
    try {
      // Verificar sessão do usuário
      const authResponse = await supabase.auth.getSession();
      console.log("Sessão atual:", authResponse);
      
      // Tenta importar em lote único primeiro
      try {
        const { error } = await supabase
          .from("shipping_rates")
          .upsert(rates, {
            onConflict: 'state,service_type,region_type'
          });
        
        if (error) {
          console.error("Erro ao importar taxas em lote único:", error);
          throw error;
        }
        
        console.log("Importação em lote único bem-sucedida!");
      } catch (bulkError) {
        console.error("Falha na importação em lote único, tentando em lotes menores:", bulkError);
        
        // Falha no lote único, tenta em lotes menores
        await importInBatches(rates);
      }
      
      // Verificar se a importação funcionou
      await verifyImport();
      
      // Atualizar os dados na interface
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Tabela de fretes importada com sucesso!");
    } catch (error) {
      console.error("Erro ao importar taxas de frete:", error);
      toast.error("Erro ao importar taxas de frete. Tente novamente.");
    } finally {
      setIsImporting(false);
    }
  };

  // Função auxiliar para importar em lotes
  const importInBatches = async (data: any[]) => {
    const batchSize = 10;
    
    for (let i = 0; i < data.length; i += batchSize) {
      try {
        const batch = data.slice(i, i + batchSize);
        console.log(`Importando lote ${i/batchSize + 1} com ${batch.length} taxas...`);
        
        const { error } = await supabase
          .from("shipping_rates")
          .upsert(batch, {
            onConflict: 'state,service_type,region_type'
          });
        
        if (error) {
          console.error(`Erro no lote ${i/batchSize + 1}:`, error);
          // Continua mesmo com erro para tentar outros lotes
        } else {
          console.log(`Lote ${i/batchSize + 1} importado com sucesso`);
        }
      } catch (batchError) {
        console.error(`Erro no processamento do lote ${i/batchSize + 1}:`, batchError);
      }
    }
  };

  // Função auxiliar para verificar se a importação funcionou
  const verifyImport = async () => {
    const { data: verifyData, error: verifyError } = await supabase
      .from("shipping_rates")
      .select("*")
      .limit(1);
      
    if (verifyError) {
      console.error("Erro ao verificar importação:", verifyError);
    } else {
      console.log("Verificação de importação:", verifyData);
    }
  };

  return {
    isImporting,
    importRates
  };
};
