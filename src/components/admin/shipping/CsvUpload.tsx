
import { useState } from 'react';
import { useImportShippingRates } from './hooks/useImportShippingRates';
import { downloadCsvTemplate, parseCsvFile } from './utils/csvUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

export const CsvUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { importRates } = useImportShippingRates([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Validar extensão
      if (!file.name.endsWith('.csv')) {
        toast.error('Por favor, selecione um arquivo CSV');
        return;
      }

      const rates = await parseCsvFile(file);
      
      // Validar dados
      if (rates.length === 0) {
        toast.error('Arquivo CSV vazio ou inválido');
        return;
      }

      // Executar importação
      await importRates(rates);
      
      // Limpar input
      event.target.value = '';
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar o arquivo CSV');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 my-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-medium">Importar/Exportar Taxas</h3>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={downloadCsvTemplate}
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar Modelo CSV
        </Button>

        <div className="relative w-full sm:w-auto">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Baixe o modelo de planilha, preencha com suas taxas e faça o upload para importar.
      </p>
    </div>
  );
};
