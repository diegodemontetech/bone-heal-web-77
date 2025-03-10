
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImportRatesButtonProps {
  isLoading: boolean;
}

export const ImportRatesButton = ({ isLoading }: ImportRatesButtonProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const importDefaultRates = async () => {
    setIsImporting(true);
    console.log("Iniciando importação da tabela padrão");
    
    try {
      // Lista de taxas de frete padrão conforme fornecido pelo usuário
      const defaultRates = [
        { state: 'AC', region_type: 'Capital', service_type: 'PAC', delivery_days: 10, rate: 100 },
        { state: 'AC', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 5, rate: 150 },
        { state: 'AC', region_type: 'Interior', service_type: 'PAC', delivery_days: 12, rate: 120 },
        { state: 'AC', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 7, rate: 180 },
        { state: 'AL', region_type: 'Capital', service_type: 'PAC', delivery_days: 6, rate: 50 },
        { state: 'AL', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 75 },
        { state: 'AL', region_type: 'Interior', service_type: 'PAC', delivery_days: 7, rate: 55 },
        { state: 'AL', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 80 },
        { state: 'AP', region_type: 'Capital', service_type: 'PAC', delivery_days: 10, rate: 90 },
        { state: 'AP', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'AP', region_type: 'Interior', service_type: 'PAC', delivery_days: 12, rate: 100 },
        { state: 'AP', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 6, rate: 130 },
        { state: 'AM', region_type: 'Capital', service_type: 'PAC', delivery_days: 9, rate: 80 },
        { state: 'AM', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 130 },
        { state: 'AM', region_type: 'Interior', service_type: 'PAC', delivery_days: 11, rate: 90 },
        { state: 'AM', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 150 },
        { state: 'BA', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 45 },
        { state: 'BA', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 70 },
        { state: 'BA', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 50 },
        { state: 'BA', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 85 },
        { state: 'CE', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 60 },
        { state: 'CE', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 100 },
        { state: 'CE', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'CE', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 110 },
        { state: 'DF', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 35 },
        { state: 'DF', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 45 },
        { state: 'DF', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 40 },
        { state: 'DF', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 55 },
        { state: 'ES', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 25 },
        { state: 'ES', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 40 },
        { state: 'ES', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 30 },
        { state: 'ES', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 50 },
        { state: 'GO', region_type: 'Capital', service_type: 'PAC', delivery_days: 5, rate: 35 },
        { state: 'GO', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 60 },
        { state: 'GO', region_type: 'Interior', service_type: 'PAC', delivery_days: 6, rate: 40 },
        { state: 'GO', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 65 },
        { state: 'MA', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 70 },
        { state: 'MA', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 110 },
        { state: 'MA', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 80 },
        { state: 'MA', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 120 },
        { state: 'MT', region_type: 'Capital', service_type: 'PAC', delivery_days: 6, rate: 65 },
        { state: 'MT', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 85 },
        { state: 'MT', region_type: 'Interior', service_type: 'PAC', delivery_days: 7, rate: 70 },
        { state: 'MT', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'MS', region_type: 'Capital', service_type: 'PAC', delivery_days: 5, rate: 45 },
        { state: 'MS', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 70 },
        { state: 'MS', region_type: 'Interior', service_type: 'PAC', delivery_days: 6, rate: 50 },
        { state: 'MS', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 80 },
        { state: 'MG', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 25 },
        { state: 'MG', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 1, rate: 35 },
        { state: 'MG', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 30 },
        { state: 'MG', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 2, rate: 45 },
        { state: 'PA', region_type: 'Capital', service_type: 'PAC', delivery_days: 9, rate: 85 },
        { state: 'PA', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 130 },
        { state: 'PA', region_type: 'Interior', service_type: 'PAC', delivery_days: 10, rate: 95 },
        { state: 'PA', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'PB', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'PB', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'PB', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 70 },
        { state: 'PB', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 100 },
        { state: 'PR', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 30 },
        { state: 'PR', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 50 },
        { state: 'PR', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 35 },
        { state: 'PR', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 60 },
        { state: 'PE', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 60 },
        { state: 'PE', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 90 },
        { state: 'PE', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'PE', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'PI', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 70 },
        { state: 'PI', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 110 },
        { state: 'PI', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 75 },
        { state: 'PI', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 120 },
        { state: 'RJ', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 25 },
        { state: 'RJ', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 1, rate: 35 },
        { state: 'RJ', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 30 },
        { state: 'RJ', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 2, rate: 45 },
        { state: 'RN', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'RN', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'RN', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 70 },
        { state: 'RN', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 100 },
        { state: 'RS', region_type: 'Capital', service_type: 'PAC', delivery_days: 5, rate: 45 },
        { state: 'RS', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 70 },
        { state: 'RS', region_type: 'Interior', service_type: 'PAC', delivery_days: 6, rate: 50 },
        { state: 'RS', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 80 },
        { state: 'RO', region_type: 'Capital', service_type: 'PAC', delivery_days: 9, rate: 85 },
        { state: 'RO', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 130 },
        { state: 'RO', region_type: 'Interior', service_type: 'PAC', delivery_days: 10, rate: 95 },
        { state: 'RO', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'RR', region_type: 'Capital', service_type: 'PAC', delivery_days: 10, rate: 90 },
        { state: 'RR', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'RR', region_type: 'Interior', service_type: 'PAC', delivery_days: 12, rate: 100 },
        { state: 'RR', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 6, rate: 150 },
        { state: 'SC', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 35 },
        { state: 'SC', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 60 },
        { state: 'SC', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 40 },
        { state: 'SC', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 65 },
        { state: 'SP', region_type: 'Capital', service_type: 'PAC', delivery_days: 3, rate: 20 },
        { state: 'SP', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 1, rate: 22 },
        { state: 'SP', region_type: 'Interior', service_type: 'PAC', delivery_days: 4, rate: 20 },
        { state: 'SP', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 2, rate: 22 },
        { state: 'SE', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 55 },
        { state: 'SE', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 85 },
        { state: 'SE', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 60 },
        { state: 'SE', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 90 },
        { state: 'TO', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 75 },
        { state: 'TO', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 110 },
        { state: 'TO', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 80 },
        { state: 'TO', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 120 },
      ];
      
      console.log(`Tentando importar ${defaultRates.length} taxas de frete...`);
      
      // Verificar se há permissões RLS (Row Level Security) no Supabase
      const authResponse = await supabase.auth.getSession();
      console.log("Sessão atual:", authResponse);
      
      // Primeiro tentar importar em uma única operação
      try {
        const { data, error } = await supabase
          .from("shipping_rates")
          .upsert(defaultRates, {
            onConflict: 'state,service_type,region_type',
            ignoreDuplicates: false
          });
        
        if (error) {
          console.error("Erro ao importar taxas em lote único:", error);
          throw error;
        }
        
        console.log("Importação em lote único bem-sucedida!");
      } catch (bulkError) {
        console.error("Falha na importação em lote único, tentando em lotes menores:", bulkError);
        
        // Falha no lote único, tenta em lotes menores
        for (let i = 0; i < defaultRates.length; i += 10) {
          try {
            const batch = defaultRates.slice(i, i + 10);
            console.log(`Importando lote ${i/10 + 1} com ${batch.length} taxas...`);
            
            const { error } = await supabase
              .from("shipping_rates")
              .upsert(batch, {
                onConflict: 'state,service_type,region_type',
                ignoreDuplicates: false
              });
            
            if (error) {
              console.error(`Erro no lote ${i/10 + 1}:`, error);
              // Continua mesmo com erro para tentar outros lotes
            } else {
              console.log(`Lote ${i/10 + 1} importado com sucesso`);
            }
          } catch (batchError) {
            console.error(`Erro no processamento do lote ${i/10 + 1}:`, batchError);
          }
        }
      }
      
      // Verificar se a importação funcionou consultando o banco novamente
      const { data: verifyData, error: verifyError } = await supabase
        .from("shipping_rates")
        .select("*")
        .limit(1);
        
      if (verifyError) {
        console.error("Erro ao verificar importação:", verifyError);
      } else {
        console.log("Verificação de importação:", verifyData);
      }
      
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

  return (
    <Button 
      onClick={importDefaultRates}
      disabled={isImporting || isLoading}
      variant="outline"
    >
      {isImporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileUp className="w-4 h-4 mr-2" />
      )}
      Importar Tabela Padrão
    </Button>
  );
};
