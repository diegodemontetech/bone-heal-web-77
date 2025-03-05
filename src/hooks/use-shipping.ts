
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { addDays } from "date-fns";

export const useShipping = () => {
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const initialZipCodeFetched = useRef(false);
  const calculationInProgress = useRef(false);
  const session = useSession();

  // Função para buscar o CEP do usuário
  const fetchUserZipCode = async () => {
    if (!session?.user?.id) return null;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('zip_code')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar CEP do usuário:', error);
        return null;
      }
      
      return profile?.zip_code;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  // Função simplificada para calcular o frete
  const calculateShipping = async (zipCodeInput) => {
    // Se já está calculando ou o CEP é inválido, não faz nada
    if (calculationInProgress.current || !zipCodeInput || zipCodeInput.length !== 8) {
      return;
    }
    
    calculationInProgress.current = true;
    setLoading(true);
    
    try {
      console.log(`Calculando frete para CEP: ${zipCodeInput}`);
      
      const weight = 0.5; // Peso em kg (simplificado)
      const subtotal = 100; // Valor subtotal (simplificado)
      
      // Cálculo simplificado baseado no CEP, peso e valor
      const fakeShippingRate = Math.round((parseInt(zipCodeInput.substring(0, 2)) / 10) * weight * 2 + 20);
      const fakeShippingRateExpress = Math.round(fakeShippingRate * 1.5);
      
      // Simula uma chamada à API com tempo fixo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const calculatedRates = [
        {
          service_type: "PAC",
          name: "PAC",
          rate: fakeShippingRate,
          delivery_days: 7,
          zipCode: zipCodeInput
        },
        {
          service_type: "SEDEX",
          name: "SEDEX",
          rate: fakeShippingRateExpress,
          delivery_days: 3,
          zipCode: zipCodeInput
        }
      ];
      
      console.log("Taxas de frete calculadas:", calculatedRates);
      setShippingRates(calculatedRates);
      
      // Seleciona a opção mais barata por padrão
      setSelectedShippingRate(calculatedRates[0]);
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error("Não foi possível calcular o frete. Por favor, tente novamente.");
      setShippingRates([]);
    } finally {
      setLoading(false);
      calculationInProgress.current = false;
    }
  };

  // Efeito para carregar o CEP do usuário apenas uma vez
  useEffect(() => {
    const loadUserShipping = async () => {
      if (!session?.user?.id || initialZipCodeFetched.current) {
        return;
      }
      
      initialZipCodeFetched.current = true;
      const userZipCode = await fetchUserZipCode();
      
      if (userZipCode && userZipCode.length === 8) {
        console.log("CEP do usuário carregado:", userZipCode);
        setZipCode(userZipCode);
        calculateShipping(userZipCode);
      }
    };

    loadUserShipping();
  }, [session?.user?.id]);

  // Efeito para calcular o frete quando o CEP mudar manualmente
  useEffect(() => {
    if (zipCode && zipCode.length === 8 && !calculationInProgress.current) {
      calculateShipping(zipCode);
    }
  }, [zipCode]);

  const handleShippingRateChange = (rate) => {
    setSelectedShippingRate(rate);
  };

  const shippingFee = selectedShippingRate ? selectedShippingRate.rate : 0;
  const deliveryDate = selectedShippingRate ? addDays(new Date(), selectedShippingRate.delivery_days) : null;

  return {
    shippingRates,
    selectedShippingRate,
    loading,
    zipCode,
    setZipCode,
    shippingFee,
    deliveryDate,
    handleShippingRateChange,
  };
};
