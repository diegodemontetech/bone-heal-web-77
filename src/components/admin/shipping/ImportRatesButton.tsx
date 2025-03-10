
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useImportShippingRates } from "./hooks/useImportShippingRates";
import { defaultShippingRates } from "./data/defaultShippingRates";
import { useEffect } from "react";

interface ImportRatesButtonProps {
  isLoading: boolean;
}

export const ImportRatesButton = ({ isLoading }: ImportRatesButtonProps) => {
  const { isImporting, importRates } = useImportShippingRates(defaultShippingRates);

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
      console.warn("Problemas encontrados nos dados padrão de frete:", validationIssues);
    } else {
      console.log("Dados padrão de frete válidos, prontos para importação");
    }
  }, []);

  const handleImport = () => {
    console.log("Iniciando processo de importação...");
    importRates();
  };

  return (
    <Button 
      onClick={handleImport}
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
