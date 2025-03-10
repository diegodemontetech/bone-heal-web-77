
import { useState, useEffect, useRef } from "react";
import { CartItem } from "@/hooks/use-cart";
import { ShippingRate } from "@/types/shipping";
import { useShippingRates } from "./use-shipping-rates";
import { useUserZipCode } from "./use-user-zip-code";
import { useDeliveryDate } from "./use-delivery-date";

export const useShipping = (cartItems: CartItem[] = []) => {
  const cartItemsRef = useRef(cartItems);
  
  // Hooks extraídos
  const {
    zipCode,
    setZipCode,
    zipCodeFetched
  } = useUserZipCode();
  
  const {
    shippingRates,
    selectedShippingRate,
    loading,
    calculateShipping: calculateShippingRates,
    handleShippingRateChange,
    resetShipping
  } = useShippingRates();
  
  const { deliveryDate } = useDeliveryDate(selectedShippingRate);

  // Atualizar a referência quando cartItems mudar
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Wrapper para a função de cálculo de frete que usa os itens do carrinho atuais
  const calculateShipping = (zipCodeInput: string) => {
    if (zipCodeInput && zipCodeInput.length === 8 && cartItemsRef.current.length > 0) {
      calculateShippingRates(zipCodeInput, cartItemsRef.current);
    }
  };

  // Efeito para calcular o frete quando o CEP for definido e tiver o formato correto
  useEffect(() => {
    const cleanZipCode = zipCode?.replace(/\D/g, '') || '';
    
    // Só calcula se tiver CEP válido e cartItems no carrinho
    if (cleanZipCode.length === 8 && cartItemsRef.current.length > 0) {
      calculateShipping(cleanZipCode);
    }
  }, [zipCode, cartItems.length]);

  // Calcular o valor do frete com base na opção selecionada
  const shippingFee = selectedShippingRate ? selectedShippingRate.rate : 0;

  return {
    shippingRates,
    selectedShippingRate,
    loading,
    zipCode,
    setZipCode,
    shippingFee,
    deliveryDate,
    handleShippingRateChange,
    resetShipping,
    calculateShipping,
    zipCodeFetched
  };
};

// Re-exportar os hooks individuais para uso específico quando necessário
export { useShippingRates } from './use-shipping-rates';
export { useUserZipCode } from './use-user-zip-code';
export { useDeliveryDate } from './use-delivery-date';
