
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ShippingCalculationRate } from "@/types/shipping";
import { useDeliveryDate } from './shipping/use-delivery-date';

type CalculateShippingResult = {
  rates: ShippingCalculationRate[];
  success: boolean;
  error?: string;
};

export function useShipping() {
  const [zipCode, setZipCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingRates, setShippingRates] = useState<ShippingCalculationRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingCalculationRate | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const { calculateDeliveryDate } = useDeliveryDate();

  useEffect(() => {
    // Update shipping fee when selected rate changes
    if (selectedShippingRate) {
      const numericRate = parseFloat(String(selectedShippingRate.rate));
      setShippingFee(isNaN(numericRate) ? 0 : numericRate);
      console.log("Shipping rate selected:", selectedShippingRate.name, "with fee:", numericRate);
      
      // Calculate delivery date based on the shipping days
      if (selectedShippingRate.delivery_days) {
        const date = calculateDeliveryDate(selectedShippingRate);
        setDeliveryDate(date);
      }
    } else {
      setShippingFee(0);
      setDeliveryDate(null);
    }
  }, [selectedShippingRate, calculateDeliveryDate]);

  // Reset shipping calculations
  const resetShipping = () => {
    setSelectedShippingRate(null);
    setShippingRates([]);
    setShippingFee(0);
    setDeliveryDate(null);
  };

  // Function to calculate shipping from API
  const calculateShipping = async (zip: string): Promise<CalculateShippingResult> => {
    if (!zip || zip.length !== 8) {
      return { rates: [], success: false, error: 'CEP inválido' };
    }

    try {
      setLoading(true);
      console.log("Executing shipping calculation for:", zip);

      // Attempt to calculate shipping via API
      const { data, error } = await supabase.functions.invoke("calculate-shipping", {
        body: { zipCode: zip }
      });

      if (error) {
        console.error("Error calculating shipping:", error);
        
        // Use fallback rates if API fails
        const fallbackRates = generateFallbackRates(zip);
        setShippingRates(fallbackRates);
        
        // Auto-select the first rate if available
        if (fallbackRates.length > 0) {
          handleShippingRateChange(fallbackRates[0]);
        }
        
        return { rates: fallbackRates, success: true };
      }

      // Process API response
      if (data && Array.isArray(data.rates) && data.rates.length > 0) {
        console.log("Shipping rates received:", data.rates);
        setShippingRates(data.rates);
        
        // Auto-select the first rate
        handleShippingRateChange(data.rates[0]);
        
        return { rates: data.rates, success: true };
      } else {
        // Use fallback if API returned no rates
        const fallbackRates = generateFallbackRates(zip);
        setShippingRates(fallbackRates);
        
        // Auto-select the first rate if available
        if (fallbackRates.length > 0) {
          handleShippingRateChange(fallbackRates[0]);
        }
        
        return { rates: fallbackRates, success: true };
      }
    } catch (err) {
      console.error("Exception calculating shipping:", err);
      
      // Use fallback rates on exception
      const fallbackRates = generateFallbackRates(zip);
      setShippingRates(fallbackRates);
      
      // Auto-select the first rate if available
      if (fallbackRates.length > 0) {
        handleShippingRateChange(fallbackRates[0]);
      }
      
      return { rates: fallbackRates, success: true };
    } finally {
      setLoading(false);
    }
  };

  // Generate fallback shipping rates based on zipcode regions
  const generateFallbackRates = (zip: string): ShippingCalculationRate[] => {
    const zipPrefix = zip.substring(0, 3);
    let baseFee = 25;
    let days = 3;
    
    // Adjust shipping based on region
    if (['010', '011', '012', '013', '014', '015'].includes(zipPrefix)) {
      // São Paulo capital
      baseFee = 15;
      days = 2;
    } else if (parseInt(zipPrefix) >= 10 && parseInt(zipPrefix) <= 199) {
      // São Paulo state
      baseFee = 20;
      days = 3;
    } else if (parseInt(zipPrefix) >= 200 && parseInt(zipPrefix) <= 299) {
      // Rio de Janeiro, Espírito Santo
      baseFee = 25;
      days = 4;
    } else if (parseInt(zipPrefix) >= 300 && parseInt(zipPrefix) <= 399) {
      // Minas Gerais
      baseFee = 25;
      days = 4;
    } else if (parseInt(zipPrefix) >= 400 && parseInt(zipPrefix) <= 499) {
      // Bahia, Sergipe
      baseFee = 30;
      days = 5;
    } else if (parseInt(zipPrefix) >= 500 && parseInt(zipPrefix) <= 599) {
      // Nordeste
      baseFee = 35;
      days = 6;
    } else if (parseInt(zipPrefix) >= 600 && parseInt(zipPrefix) <= 699) {
      // Ceará, Piauí, Maranhão
      baseFee = 40;
      days = 7;
    } else if (parseInt(zipPrefix) >= 700 && parseInt(zipPrefix) <= 799) {
      // Norte
      baseFee = 45;
      days = 8;
    } else {
      // Centro-Oeste
      baseFee = 35;
      days = 6;
    }
    
    return [
      {
        id: 'sedex',
        service_type: 'Sedex',
        name: 'Sedex - Entrega Rápida',
        rate: baseFee + 10,
        delivery_days: days,
        zipCode: zip
      },
      {
        id: 'pac',
        service_type: 'PAC',
        name: 'PAC - Entrega Econômica',
        rate: baseFee,
        delivery_days: days + 2,
        zipCode: zip
      }
    ];
  };

  // Handler for changing selected shipping rate
  const handleShippingRateChange = (rate: ShippingCalculationRate) => {
    console.log("Selecting shipping rate:", rate.name, "with fee:", rate.rate);
    setSelectedShippingRate(rate);
    const numericRate = parseFloat(String(rate.rate));
    setShippingFee(isNaN(numericRate) ? 0 : numericRate);
    
    if (rate.delivery_days) {
      const date = calculateDeliveryDate(rate);
      setDeliveryDate(date);
    }
  };

  return {
    zipCode,
    setZipCode,
    loading,
    shippingRates,
    selectedShippingRate,
    setSelectedShippingRate,
    calculateShipping,
    shippingFee,
    deliveryDate,
    handleShippingRateChange,
    resetShipping
  };
}
