
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { defaultShippingRates } from "./data/defaultShippingRates";
import { useImportShippingRates } from "./hooks/useImportShippingRates";

interface ImportRatesButtonProps {
  isLoading: boolean;
}

export const ImportRatesButton = ({ isLoading }: ImportRatesButtonProps) => {
  const { isImporting, importRates } = useImportShippingRates(defaultShippingRates);

  return (
    <Button 
      onClick={importRates}
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
