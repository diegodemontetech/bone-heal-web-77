
import { useEffect } from "react";
import { useShippingState } from "./shipping/useShippingState";
import { useShippingCalculator } from "./shipping/useShippingCalculator";

export const useShippingCalculation = (initialZipCode: string = "", customerZipCode?: string) => {
  const {
    shippingOptions,
    setShippingOptions,
    selectedShipping,
    setSelectedShipping,
    isCalculatingShipping,
    setIsCalculatingShipping,
    zipCode,
    setZipCode,
    handleZipCodeChange,
    isZipCodeValid,
    getCleanZipCode,
    updateCustomerZipCode
  } = useShippingState(initialZipCode);

  const { calculateShipping } = useShippingCalculator({
    isZipCodeValid,
    getCleanZipCode,
    setIsCalculatingShipping,
    setShippingOptions,
    selectedShipping,
    setSelectedShipping
  });

  // Atualizar CEP do cliente quando mudar
  useEffect(() => {
    updateCustomerZipCode(customerZipCode);
  }, [customerZipCode]);

  // Calcular frete automaticamente quando o CEP tiver 8 dígitos
  useEffect(() => {
    const cleanZipCode = getCleanZipCode();
    if (cleanZipCode.length === 8) {
      calculateShipping();
    }
  }, [zipCode]);

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

// Reexportando as funções individuais para manter compatibilidade
export { 
  fetchShippingRates,
  createDefaultShippingRates 
} from "./shipping/useShippingRates";
