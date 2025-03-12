
import { useState } from "react";
import { ShippingCalculationRate } from "@/types/shipping";
import { toast } from "sonner";
import { useZipCodeFormatter } from "./useZipCodeFormatter";
import { fetchShippingRates } from "./useShippingRates";

export const useShippingState = (initialZipCode: string = "", customerZipCode?: string) => {
  const [shippingOptions, setShippingOptions] = useState<ShippingCalculationRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const {
    zipCode,
    setZipCode,
    handleZipCodeChange,
    isZipCodeValid,
    getCleanZipCode
  } = useZipCodeFormatter(initialZipCode);

  // Atualizar CEP quando o cliente mudar
  const updateCustomerZipCode = (newZipCode?: string) => {
    if (newZipCode) {
      setZipCode(newZipCode);
    }
  };

  return {
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
  };
};
