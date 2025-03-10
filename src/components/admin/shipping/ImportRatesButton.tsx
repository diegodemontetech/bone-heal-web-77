
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useImportShippingRates } from "./hooks/useImportShippingRates";
import { defaultShippingRates } from "./data/defaultShippingRates";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImportRatesButtonProps {
  isLoading: boolean;
}

export const ImportRatesButton = ({ isLoading }: ImportRatesButtonProps) => {
  const { isImporting, importRates } = useImportShippingRates(defaultShippingRates);
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
  }, []);

  const handleImport = () => {
    try {
      console.log("Iniciando processo de importação...");
      console.log(`Total de taxas para importar: ${defaultShippingRates.length}`);
      
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

  return (
    <div className="flex flex-col gap-2">
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
        {isImporting ? "Importando..." : "Importar Tabela Padrão"}
      </Button>
      {validationStatus && (
        <p className="text-xs text-muted-foreground">
          {validationStatus}
        </p>
      )}
    </div>
  );
};
