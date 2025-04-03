
import { useShippingRates } from '@/hooks/admin/use-shipping-rates';
import { useDeliveryDate } from './use-delivery-date';
import { useUserZipCode } from './use-user-zip-code';
import { ShippingCalculationRate } from '@/types/shipping';

export const useShipping = () => {
  // Dados originais das taxas de envio
  const {
    rates,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateRate,
    handleDeleteRate,
    exportRates,
    insertShippingRates,
    shippingOptions,
    shippingRates,
    selectedShippingRate,
    calculateShipping,
    handleShippingRateChange,
    resetShipping,
    zipCode,
    setZipCode
  } = useShippingRates();

  // Utilidades para data de entrega
  const { calculateDeliveryDate } = useDeliveryDate();
  const formatDeliveryDate = (shippingRate: ShippingCalculationRate) => {
    const date = calculateDeliveryDate(shippingRate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  // Gerenciamento do CEP do usuário
  const { 
    zipCode: userZipCodeFromHook, 
    setZipCode: setUserZipCodeFromHook, 
    zipCodeFetched, 
    loadUserZipCode 
  } = useUserZipCode();

  return {
    // Propriedades de taxas de envio
    rates,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateRate,
    handleDeleteRate,
    exportRates,
    insertShippingRates,
    
    // Propriedades específicas de envio
    formatDeliveryDate,
    zipCode,
    setZipCode,
    zipCodeFetched,
    loadUserZipCode,
    shippingRates,
    shippingOptions,
    selectedShippingRate,
    calculateShipping,
    handleShippingRateChange,
    resetShipping,
    shippingFee: selectedShippingRate ? selectedShippingRate.rate : 0,
    deliveryDate: selectedShippingRate ? (selectedShippingRate.delivery_days ? new Date(Date.now() + selectedShippingRate.delivery_days * 24 * 60 * 60 * 1000) : null) : null
  };
};
