
import { useShippingRates } from '@/hooks/admin/use-shipping-rates';
import { useDeliveryDate } from './use-delivery-date';
import { useUserZipCode } from './use-user-zip-code';
import { ShippingCalculationRate } from '@/types/shipping';
import { useCallback, useState, useEffect, useRef } from 'react';

export const useShipping = () => {
  // Flag to prevent recursive calculations
  const [isProcessingShipping, setIsProcessingShipping] = useState(false);
  const alreadyCalculatedRef = useRef(false);
  
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
    calculateShipping: originalCalculateShipping,
    handleShippingRateChange,
    resetShipping,
    zipCode,
    setZipCode
  } = useShippingRates();

  // Utilidades para data de entrega
  const { calculateDeliveryDate } = useDeliveryDate();
  const formatDeliveryDate = useCallback((shippingRate: ShippingCalculationRate) => {
    const date = calculateDeliveryDate(shippingRate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long'
    }).format(date);
  }, [calculateDeliveryDate]);

  // Gerenciamento do CEP do usuário
  const { 
    zipCode: userZipCodeFromHook, 
    setZipCode: setUserZipCodeFromHook, 
    zipCodeFetched, 
    loadUserZipCode 
  } = useUserZipCode();
  
  // Wrapper para evitar recursão no cálculo de frete
  const calculateShipping = useCallback((zipCodeParam?: string) => {
    if (isProcessingShipping) {
      console.log("Cálculo de frete já em andamento, ignorando nova solicitação");
      return;
    }
    
    if (alreadyCalculatedRef.current && selectedShippingRate) {
      console.log("Frete já calculado e selecionado, ignorando novo cálculo");
      return;
    }
    
    setIsProcessingShipping(true);
    const zipToUse = zipCodeParam || zipCode;
    
    // Adicionar um pequeno atraso para evitar múltiplas chamadas simultâneas
    setTimeout(() => {
      console.log("Executando cálculo de frete para:", zipToUse);
      originalCalculateShipping(zipToUse);
      alreadyCalculatedRef.current = true;
      setIsProcessingShipping(false);
    }, 300);
  }, [isProcessingShipping, selectedShippingRate, zipCode, originalCalculateShipping]);

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
    isProcessingShipping,
    shippingFee: selectedShippingRate ? selectedShippingRate.rate : 0,
    deliveryDate: selectedShippingRate ? (selectedShippingRate.delivery_days ? new Date(Date.now() + selectedShippingRate.delivery_days * 24 * 60 * 60 * 1000) : null) : null
  };
};
