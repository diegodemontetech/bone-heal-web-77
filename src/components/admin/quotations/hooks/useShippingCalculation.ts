
import { useState, useEffect } from "react";
import { ShippingCalculationRate } from "@/types/shipping";
import { toast } from "sonner";
import { useZipCodeFormatter } from "./shipping/useZipCodeFormatter";
import { fetchShippingRates, createDefaultShippingRates } from "./shipping/useShippingRates";

export const useShippingCalculation = (initialZipCode: string = "", customerZipCode?: string) => {
  const { 
    zipCode, 
    setZipCode, 
    handleZipCodeChange, 
    isZipCodeValid 
  } = useZipCodeFormatter(initialZipCode);
  
  const [shippingOptions, setShippingOptions] = useState<ShippingCalculationRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  useEffect(() => {
    if (customerZipCode) {
      setZipCode(customerZipCode);
    }
  }, [customerZipCode, setZipCode]);

  const calculateShipping = async () => {
    if (!isZipCodeValid()) {
      toast.error("CEP inválido");
      return;
    }

    setIsCalculatingShipping(true);
    
    try {
      // Buscar taxas de frete 
      const rates = await fetchShippingRates({ zipCode });
      
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
      const defaultOptions = createDefaultShippingRates(zipCode);
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
    zipCode,
    setZipCode,
    handleZipCodeChange,
    isCalculatingShipping,
    calculateShipping,
    shippingOptions,
    selectedShipping,
    setSelectedShipping
  };
};
