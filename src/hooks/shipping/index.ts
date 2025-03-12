
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
    resetShipping
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
    zipCode: userZipCode, 
    setZipCode: setUserZipCode, 
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
    userZipCode,
    setUserZipCode,
    zipCodeFetched,
    loadUserZipCode,
    shippingRates,
    shippingOptions,
    selectedShippingRate,
    calculateShipping,
    handleShippingRateChange,
    resetShipping
  };
};
