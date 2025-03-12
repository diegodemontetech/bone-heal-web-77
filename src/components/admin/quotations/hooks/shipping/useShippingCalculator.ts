
import { ShippingCalculationRate } from "@/types/shipping";
import { toast } from "sonner";
import { fetchShippingRates, createDefaultShippingRates } from "./useShippingRates";

interface UseShippingCalculatorProps {
  isZipCodeValid: () => boolean;
  getCleanZipCode: () => string;
  setIsCalculatingShipping: (value: boolean) => void;
  setShippingOptions: (options: ShippingCalculationRate[]) => void;
  selectedShipping: ShippingCalculationRate | null;
  setSelectedShipping: (shipping: ShippingCalculationRate | null) => void;
}

export const useShippingCalculator = ({
  isZipCodeValid,
  getCleanZipCode,
  setIsCalculatingShipping,
  setShippingOptions,
  selectedShipping,
  setSelectedShipping
}: UseShippingCalculatorProps) => {
  
  const calculateShipping = async () => {
    if (!isZipCodeValid()) {
      toast.error("CEP inválido");
      return;
    }

    const cleanZipCode = getCleanZipCode();
    setIsCalculatingShipping(true);
    
    try {
      console.log(`Calculando frete para CEP: ${cleanZipCode}`);
      
      const rates = await fetchShippingRates({ zipCode: cleanZipCode });
      
      console.log("Taxas recuperadas:", rates);
      
      // Ordenar por preço
      rates.sort((a, b) => a.rate - b.rate);
      
      setShippingOptions(rates);
      
      // Selecionar a opção mais barata por padrão, se ainda não houver seleção
      if (rates.length > 0 && !selectedShipping) {
        setSelectedShipping(rates[0]);
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      
      // Criar opções padrão em caso de erro
      const defaultOptions = createDefaultShippingRates(cleanZipCode);
      setShippingOptions(defaultOptions);
      
      // Selecionar a opção mais barata por padrão se não houver nenhuma selecionada
      if (!selectedShipping) {
        setSelectedShipping(defaultOptions[0]);
      }
      
      toast.error('Erro ao calcular frete. Usando valores padrão.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  return {
    calculateShipping
  };
};
