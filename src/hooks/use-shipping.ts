
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";

export const useShipping = () => {
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [calculationCompleted, setCalculationCompleted] = useState(false);
  const session = useSession();
  const { toast } = useToast();

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

  // Função para calcular o frete
  const calculateShipping = async (zipCodeInput) => {
    if (!zipCodeInput || zipCodeInput.length !== 8 || calculationCompleted || loading) return;
    
    setLoading(true);
    
    try {
      console.log(`Calculando frete para CEP: ${zipCodeInput}`);
      
      const { data, error } = await supabase.functions.invoke("correios-shipping", {
        body: {
          zipCode: zipCodeInput,
          zipCodeDestination: zipCodeInput,
        },
      });

      if (error) {
        console.error("Erro na resposta da função:", error);
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Resposta inválida:", data);
        throw new Error("Resposta inválida do serviço de frete");
      }

      console.log("Resposta do cálculo de frete:", data);
      
      const ratesWithZipCode = data.map(rate => ({
        ...rate,
        zipCode: zipCodeInput
      }));
      
      setShippingRates(ratesWithZipCode);
      
      // Se houver apenas uma opção de frete, seleciona automaticamente
      if (ratesWithZipCode.length === 1) {
        setSelectedShippingRate(ratesWithZipCode[0]);
      } else if (ratesWithZipCode.length > 1) {
        // Seleciona a opção mais barata por padrão
        const cheapestRate = ratesWithZipCode.reduce((prev, curr) => 
          prev.rate < curr.rate ? prev : curr
        );
        setSelectedShippingRate(cheapestRate);
      }
      
      setCalculationCompleted(true);
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast({
        title: "Erro no cálculo do frete",
        description: "Não foi possível calcular o frete. Por favor, tente novamente.",
        variant: "destructive"
      });
      setShippingRates([]);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar o CEP do usuário automaticamente quando estiver logado
  useEffect(() => {
    const loadUserShipping = async () => {
      if (session?.user?.id && !hasAttemptedFetch && !calculationCompleted) {
        setHasAttemptedFetch(true);
        const userZipCode = await fetchUserZipCode();
        if (userZipCode) {
          setZipCode(userZipCode);
          await calculateShipping(userZipCode);
        }
      }
    };

    loadUserShipping();
  }, [session?.user?.id, hasAttemptedFetch, calculationCompleted]);

  // Função para resetar o estado do cálculo de frete
  const resetShippingCalculation = () => {
    setCalculationCompleted(false);
    setShippingRates([]);
    setSelectedShippingRate(null);
  };

  // Efeito para resetar o cálculo quando o CEP mudar
  useEffect(() => {
    if (zipCode && calculationCompleted) {
      // Se o CEP mudou e já tínhamos calculado antes, resetamos
      resetShippingCalculation();
    }
  }, [zipCode]);

  // Calcula a data estimada de entrega
  const getDeliveryDate = () => {
    if (!selectedShippingRate) return null;
    const deliveryDays = selectedShippingRate.delivery_days || 5;
    return addDays(new Date(), deliveryDays);
  };

  const handleShippingRateChange = (rate) => {
    setSelectedShippingRate(rate);
  };

  const shippingFee = selectedShippingRate ? selectedShippingRate.rate : 0;
  const deliveryDate = getDeliveryDate();
  const isCalculatingShipping = loading;
  const availableShippingRates = shippingRates;

  return {
    shippingRates,
    selectedShippingRate,
    setSelectedShippingRate,
    loading,
    calculateShipping,
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingFee,
    deliveryDate,
    availableShippingRates,
    handleShippingRateChange,
    calculationCompleted,
    resetShippingCalculation
  };
};
