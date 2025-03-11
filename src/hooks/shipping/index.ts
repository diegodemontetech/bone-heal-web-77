
import { useShippingRates } from "./use-shipping-rates";
import { useDeliveryDate } from "./use-delivery-date";
import { useUserZipCode } from "./use-user-zip-code";

export { useShippingRates, useDeliveryDate, useUserZipCode };

export const useShipping = (cartItems = []) => {
  const {
    shippingRates,
    selectedShippingRate,
    loading,
    calculateShipping,
    handleShippingRateChange,
    resetShipping,
  } = useShippingRates();
  
  const { calculateDeliveryDate } = useDeliveryDate();
  const { zipCode, setZipCode, loadUserZipCode } = useUserZipCode();

  const handleZipCodeChange = (newZipCode) => {
    setZipCode(newZipCode);
    if (newZipCode && newZipCode.length === 8) {
      calculateShipping(newZipCode, cartItems);
    }
  };

  const handleZipCodeSubmit = () => {
    if (zipCode && zipCode.length === 8) {
      calculateShipping(zipCode, cartItems);
    }
  };

  // Calcular data de entrega
  const deliveryDate = calculateDeliveryDate(selectedShippingRate);
  
  // Obter preço do frete
  const shippingFee = selectedShippingRate ? selectedShippingRate.rate : 0;

  return {
    shippingRates,
    selectedShippingRate,
    loading,
    zipCode,
    setZipCode: handleZipCodeChange,
    loadUserZipCode,
    calculateShipping,
    handleShippingRateChange,
    handleZipCodeSubmit,
    resetShipping,
    deliveryDate,
    shippingFee,
  };
};
