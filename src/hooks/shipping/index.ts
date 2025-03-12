
import { useShippingRates } from "@/hooks/admin/use-shipping-rates";
import { useDeliveryDate } from "./use-delivery-date";
import { useUserZipCode } from "./use-user-zip-code";

export const useShipping = () => {
  const {
    rates,
    loading,
    shippingOptions,
    // Renomeando para evitar conflitos
    shippingRates: _shippingRates,
    selectedShippingRate: _selectedShippingRate,
    calculateShipping: _calculateShipping,
    handleShippingRateChange: _handleShippingRateChange,
    resetShipping: _resetShipping,
    ...restShippingRatesHook
  } = useShippingRates();

  const { formatDeliveryDate } = useDeliveryDate();
  const { userZipCode, setUserZipCode } = useUserZipCode();

  // Definindo as propriedades ausentes com funções vazias para compatibilidade
  const shippingRates = rates || [];
  const selectedShippingRate = null;
  const calculateShipping = () => {};
  const handleShippingRateChange = () => {};
  const resetShipping = () => {};

  return {
    rates,
    loading,
    shippingOptions,
    formatDeliveryDate,
    userZipCode,
    setUserZipCode,
    ...restShippingRatesHook,
    // Adicionando as propriedades ausentes
    shippingRates,
    selectedShippingRate,
    calculateShipping,
    handleShippingRateChange,
    resetShipping
  };
};
