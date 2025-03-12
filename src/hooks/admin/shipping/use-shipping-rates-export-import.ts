
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useShippingRatesExportImport = () => {
  const exportRates = (rates: any[]) => {
    const csv = Papa.unparse(rates);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'taxas_de_envio.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insertShippingRates = async (rates: any[]) => {
    try {
      const { error } = await supabase
        .from('shipping_rates')
        .insert(
          rates.map(rate => ({
            region: rate.region || '',
            state: rate.state || rate.region || '',
            zip_code_start: rate.zip_code_start || '',
            zip_code_end: rate.zip_code_end || '',
            flat_rate: rate.flat_rate || 0,
            rate: rate.flat_rate || 0,
            additional_kg_rate: rate.additional_kg_rate || 0,
            estimated_days: rate.estimated_days || 3,
            is_active: true
          }))
        );
      
      if (error) throw error;
      toast.success("Taxas de envio importadas com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao importar taxas:", error);
      toast.error("Erro ao importar taxas de envio");
      return false;
    }
  };

  return {
    exportRates,
    insertShippingRates
  };
};
