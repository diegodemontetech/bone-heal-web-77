
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useImportShippingRates } from "./hooks/useImportShippingRates";
import { defaultShippingRates } from "./data/defaultShippingRates";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/auth/auth-context";

interface ImportRatesButtonProps {
  isLoading: boolean;
}

export const ImportRatesButton = ({ isLoading }: ImportRatesButtonProps) => {
  const { isImporting, importRates } = useImportShippingRates(defaultShippingRates);
  const { isAdmin, profile } = useAuthContext();
  const [validationStatus, setValidationStatus] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se os dados padrão são válidos
    const validationIssues = defaultShippingRates.filter(rate => 
      !rate.state || 
      !rate.region_type || 
      !rate.service_type || 
      typeof rate.rate !== 'number' || 
      typeof rate.delivery_days !== 'number'
    );
    
    if (validationIssues.length > 0) {
      const message = `Problemas encontrados em ${validationIssues.length} taxas de frete padrão`;
      console.warn(message, validationIssues);
      setValidationStatus(message);
    } else {
      const message = `${defaultShippingRates.length} taxas de frete prontas para importação`;
      console.log(message);
      setValidationStatus(message);
    }

    // Verificar se há duplicatas na combinação de state, region_type e service_type
    const combinations = new Set();
    const duplicates = defaultShippingRates.filter(rate => {
      const combo = `${rate.state}-${rate.region_type}-${rate.service_type}`;
      if (combinations.has(combo)) return true;
      combinations.add(combo);
      return false;
    });

    if (duplicates.length > 0) {
      console.warn(`ATENÇÃO: Encontradas ${duplicates.length} combinações duplicadas nas taxas padrão`, duplicates);
      setValidationStatus(prev => `${prev || ''} | Atenção: ${duplicates.length} combinações duplicadas detectadas`);
    }
  }, []);

  const handleImport = () => {
    try {
      if (!isAdmin) {
        toast.error("Apenas administradores podem importar taxas de frete");
        return;
      }

      console.log("Iniciando processo de importação...");
      console.log(`Total de taxas para importar: ${defaultShippingRates.length}`);
      console.log("Usuário logado:", profile?.id);
      console.log("É administrador:", isAdmin);
      
      // Verificar se há validação antes de importar
      if (validationStatus && validationStatus.includes("Problemas")) {
        console.warn("Tentando importar com erros de validação:", validationStatus);
        toast.warning("Há problemas com os dados de frete que podem afetar a importação");
      }
      
      importRates();
    } catch (error) {
      console.error("Erro ao iniciar importação:", error);
      toast.error("Falha ao iniciar importação");
    }
  };

  // Se não for admin, desabilitar o botão
  const isDisabled = isImporting || isLoading || !isAdmin;

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleImport}
        disabled={isDisabled}
        variant="outline"
      >
        {isImporting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
        ) : (
          <FileUp className="w-4 h-4 mr-2" />
        )}
        {isImporting ? "Importando..." : "Importar Tabela Padrão"}
      </Button>
      {!isAdmin && (
        <p className="text-xs text-red-500">
          Você precisa ser administrador para importar taxas
        </p>
      )}
      {validationStatus && (
        <p className="text-xs text-muted-foreground">
          {validationStatus}
        </p>
      )}
    </div>
  );
};
