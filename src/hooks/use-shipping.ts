
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export interface ShippingRate {
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
}

export function useShipping() {
  const session = useSession();
  const [zipCode, setZipCode] = useState<string>("");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [availableShippingRates, setAvailableShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('zip_code')
          .eq('id', session.user.id)
          .single();

        if (profile?.zip_code) {
          setZipCode(profile.zip_code);
          calculateShipping(profile.zip_code);
        }
      }
    };

    loadUserProfile();
  }, [session]);

  const calculateDeliveryDate = (shippingDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + shippingDays);
    setDeliveryDate(date);
  };

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8) {
      return;
    }

    setIsCalculatingShipping(true);
    
    try {
      const { data: shippingRates, error } = await supabase
        .from('shipping_rates')
        .select('rate, delivery_days, service_type')
        .in('service_type', ['PAC', 'SEDEX'])
        .eq('state', 'SP');

      if (error) throw error;

      if (shippingRates?.length) {
        // Inicialmente seleciona o PAC como padrão
        const pacRate = shippingRates.find(rate => rate.service_type === 'PAC');
        if (pacRate) {
          setShippingFee(pacRate.rate);
          calculateDeliveryDate(pacRate.delivery_days);
          setSelectedShippingRate({
            ...pacRate,
            name: 'Convencional'
          });
        }
        
        setAvailableShippingRates(shippingRates.map(rate => ({
          ...rate,
          name: rate.service_type === 'PAC' ? 'Convencional' : 'Express'
        })));
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleShippingRateChange = (rate: ShippingRate) => {
    setShippingFee(rate.rate);
    calculateDeliveryDate(rate.delivery_days);
    setSelectedShippingRate(rate);
  };

  return {
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingFee,
    deliveryDate,
    availableShippingRates,
    selectedShippingRate,
    calculateShipping,
    handleShippingRateChange
  };
}
