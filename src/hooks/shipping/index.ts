
import { useShippingRates } from '@/hooks/admin/use-shipping-rates';
import { useDeliveryDate } from './use-delivery-date';
import { useUserZipCode } from './use-user-zip-code';
import { ShippingCalculationRate } from '@/types/shipping';
import { useCallback, useState, useEffect, useRef } from 'react';

export const useShipping = () => {
  // Flag to prevent recursive calculations
  const [isProcessingShipping, setIsProcessingShipping] = useState(false);
  const calculationAttempted = useRef(false);
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCalculatedZipCode = useRef<string>("");
  
  // Original shipping rates data
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

  // Delivery date utilities
  const { calculateDeliveryDate } = useDeliveryDate();
  const formatDeliveryDate = useCallback((shippingRate: ShippingCalculationRate) => {
    const date = calculateDeliveryDate(shippingRate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long'
    }).format(date);
  }, [calculateDeliveryDate]);

  // User zip code management with the preventInitialFetch flag to prevent auto-loading
  const { 
    zipCode: userZipCodeFromHook, 
    setZipCode: setUserZipCodeFromHook, 
    zipCodeFetched, 
    loadUserZipCode 
  } = useUserZipCode();
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, []);
  
  // Wrapper to prevent recursive shipping calculations
  const calculateShipping = useCallback((zipCodeParam?: string) => {
    // Prevent calculation if already in progress
    if (isProcessingShipping) {
      console.log("Shipping calculation already in progress, ignoring new request");
      return;
    }
    
    // Skip calculation if we've already calculated for this zip code
    const zipToUse = zipCodeParam || zipCode;
    if (lastCalculatedZipCode.current === zipToUse && selectedShippingRate) {
      console.log("Shipping already calculated for this zip code, reusing result");
      return;
    }
    
    // Clear any existing calculation timeout
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }
    
    setIsProcessingShipping(true);
    
    if (!zipToUse || zipToUse.length !== 8) {
      console.log("Invalid ZIP code for calculation:", zipToUse);
      setIsProcessingShipping(false);
      return;
    }
    
    // Delay to debounce and prevent multiple calls
    calculationTimeoutRef.current = setTimeout(() => {
      try {
        console.log("Executing shipping calculation for:", zipToUse);
        originalCalculateShipping(zipToUse);
        calculationAttempted.current = true;
        lastCalculatedZipCode.current = zipToUse;
      } catch (error) {
        console.error("Error in shipping calculation:", error);
      } finally {
        setIsProcessingShipping(false);
      }
    }, 300);
    
  }, [isProcessingShipping, selectedShippingRate, zipCode, originalCalculateShipping]);

  return {
    // Shipping rate properties
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
    
    // Specific shipping properties
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
