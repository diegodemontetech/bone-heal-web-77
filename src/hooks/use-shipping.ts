import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { CartItem } from "@/hooks/use-cart";

const MAX_SHIPPING_COST = 60;
const PRODUCT_WEIGHT_GRAMS = 200;

const MOCK_SHIPPING_RATES = [
  {
    id: 'sedex',
    service_type: 'SEDEX',
    name: 'SEDEX - Entrega expressa',
    rate: 29.90,
    delivery_days: 2,
    zipCode: '00000000'
  },
  {
    id: 'pac',
    service_type: 'PAC',
    name: 'PAC - Entrega econômica',
    rate: 19.90,
    delivery_days: 6,
    zipCode: '00000000'
  }
];

export const useShipping = (cartItems: CartItem[] = []) => {
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [zipCodeFetched, setZipCodeFetched] = useState(false);
  const calculationInProgress = useRef(false);
  const session = useSession();
  const lastCalculatedZipCode = useRef("");
  const cartItemsRef = useRef(cartItems);
  const initialLoadRef = useRef(true);
  const calculationCount = useRef(0);
  
  const MAX_CALCULATIONS = 3;
  const calculationTimer = useRef<any>(null);

  useEffect(() => {
    cartItemsRef.current = cartItems;
    
    if (zipCode && zipCode.length === 8 && cartItems.length > 0 && initialLoadRef.current === false) {
      if (lastCalculatedZipCode.current !== zipCode || 
          (shippingRates.length === 0 && selectedShippingRate === null)) {
        calculateShipping(zipCode);
      }
    }
  }, [cartItems]);

  const fetchUserZipCode = async () => {
    if (!session?.user?.id) {
      console.log('Sessão não disponível para busca de CEP');
      return null;
    }
    
    try {
      console.log('Buscando CEP para o usuário:', session.user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('zip_code, address')
        .eq('id', session.user.id)
        .single();
        
      console.log('Perfil recuperado:', profile);
      
      if (error) {
        console.error('Erro ao buscar CEP do usuário:', error);
        return null;
      }
      
      setZipCodeFetched(true);
      
      if (profile?.zip_code && profile.zip_code.length >= 8) {
        console.log('CEP encontrado no perfil:', profile.zip_code);
        return profile.zip_code.replace(/\D/g, '');
      }
      
      if (profile && profile.address && typeof profile.address === 'object') {
        const address = profile.address as Record<string, any>;
        if ('postal_code' in address && address.postal_code) {
          const postalCode = String(address.postal_code);
          console.log('CEP encontrado no endereço:', postalCode);
          return postalCode.replace(/\D/g, '');
        }
      }
      
      console.log('Nenhum CEP válido encontrado para o usuário');
      return null;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  const calculateShipping = async (zipCodeInput: string) => {
    if (!zipCodeInput) {
      console.log("CEP não fornecido para cálculo");
      return;
    }
    
    const cleanZipCode = zipCodeInput.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      console.log("CEP inválido para cálculo (deve ter 8 dígitos):", cleanZipCode);
      return;
    }
    
    if (lastCalculatedZipCode.current === cleanZipCode && shippingRates.length > 0 && selectedShippingRate) {
      console.log("Usando taxas de frete já calculadas para o CEP:", cleanZipCode);
      return;
    }
    
    if (calculationInProgress.current) {
      console.log("Cálculo de frete já em andamento, ignorando nova solicitação");
      return;
    }
    
    calculationCount.current += 1;
    if (calculationCount.current > MAX_CALCULATIONS) {
      if (calculationTimer.current) {
        clearTimeout(calculationTimer.current);
      }
      calculationTimer.current = setTimeout(() => {
        calculationCount.current = 0;
      }, 5000);
      
      console.log(`Limite de cálculos atingido (${MAX_CALCULATIONS}). Ignorando nova solicitação.`);
      return;
    }
    
    calculationInProgress.current = true;
    setLoading(true);
    
    try {
      console.log(`Calculando frete para CEP: ${cleanZipCode} com ${cartItemsRef.current.length} itens`);
      
      const totalItems = cartItemsRef.current.reduce((total, item) => total + (item.quantity || 1), 0);
      const totalWeightKg = (totalItems * PRODUCT_WEIGHT_GRAMS) / 1000;
      
      console.log(`Peso total dos itens: ${totalWeightKg}kg`);
      
      const itemsWithWeight = cartItemsRef.current.map(item => ({
        ...item,
        weight: (PRODUCT_WEIGHT_GRAMS / 1000)
      }));
      
      let data;
      let error;
      
      try {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log('Ambiente de desenvolvimento: simulando cálculo de frete');
          
          data = [
            {
              id: 'sedex',
              service_type: 'SEDEX',
              name: 'SEDEX - Entrega expressa',
              rate: Math.min(35.90 + totalWeightKg * 5 + parseFloat((Math.random() * 20).toFixed(2)), MAX_SHIPPING_COST),
              delivery_days: 2,
              zipCode: cleanZipCode,
              estimatedDelivery: addDays(new Date(), 2).toISOString().split('T')[0]
            },
            {
              id: 'pac',
              service_type: 'PAC',
              name: 'PAC - Entrega econômica',
              rate: Math.min(22.90 + totalWeightKg * 3 + parseFloat((Math.random() * 10).toFixed(2)), MAX_SHIPPING_COST),
              delivery_days: 6,
              zipCode: cleanZipCode,
              estimatedDelivery: addDays(new Date(), 6).toISOString().split('T')[0]
            }
          ];
          error = null;
        } else {
          const result = await supabase.functions.invoke('correios-shipping', {
            body: {
              zipCode: cleanZipCode,
              items: itemsWithWeight
            }
          });
          
          data = result.data;
          error = result.error;
        }
      } catch (functionError) {
        console.error("Erro ao chamar a Edge Function:", functionError);
        error = { message: 'Erro ao acessar serviço de cálculo de frete' };
      }
      
      if (error) {
        console.error("Erro na API de frete:", error.message);
        
        const mockRatesWithWeight = MOCK_SHIPPING_RATES.map(rate => {
          let adjustedRate = rate.rate;
          if (totalWeightKg > 0.5) {
            const additionalWeight = totalWeightKg - 0.5;
            adjustedRate += additionalWeight * 10;
          }
          
          adjustedRate = Math.min(adjustedRate, MAX_SHIPPING_COST);
          
          return {
            ...rate,
            rate: adjustedRate,
            zipCode: cleanZipCode,
            estimatedDelivery: addDays(new Date(), rate.delivery_days).toISOString().split('T')[0]
          };
        });
        
        setShippingRates(mockRatesWithWeight);
        setSelectedShippingRate(mockRatesWithWeight[0]);
        lastCalculatedZipCode.current = cleanZipCode;
        return;
      }
      
      console.log("Resposta da API de frete:", data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("Resposta vazia da API de frete, usando dados mockados");
        
        const mockRatesWithWeight = MOCK_SHIPPING_RATES.map(rate => {
          let adjustedRate = rate.rate;
          if (totalWeightKg > 0.5) {
            const additionalWeight = totalWeightKg - 0.5;
            adjustedRate += additionalWeight * 10;
          }
          
          adjustedRate = Math.min(adjustedRate, MAX_SHIPPING_COST);
          
          return {
            ...rate,
            rate: adjustedRate,
            zipCode: cleanZipCode
          };
        });
        
        setShippingRates(mockRatesWithWeight);
        setSelectedShippingRate(mockRatesWithWeight[0]);
        console.log("Default shipping rate set:", mockRatesWithWeight[0]);
        lastCalculatedZipCode.current = cleanZipCode;
        return;
      }
      
      lastCalculatedZipCode.current = cleanZipCode;
      
      const ratesWithLimits = data.map(rate => ({
        ...rate,
        rate: Math.min(parseFloat(rate.rate) || 0, MAX_SHIPPING_COST)
      }));
      
      setShippingRates(ratesWithLimits);
      
      if (ratesWithLimits && ratesWithLimits.length > 0) {
        const cheapestRate = ratesWithLimits.reduce((prev, curr) => 
          prev.rate < curr.rate ? prev : curr
        );
        setSelectedShippingRate(cheapestRate);
        console.log("Selected shipping rate:", cheapestRate);
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      
      console.log('Usando dados mockados para o frete devido ao erro');
      
      const mockRatesWithWeight = MOCK_SHIPPING_RATES.map(rate => {
        let adjustedRate = rate.rate;
        if (cartItemsRef.current.length > 0) {
          const totalItems = cartItemsRef.current.reduce((total, item) => total + (item.quantity || 1), 0);
          const totalWeightKg = (totalItems * PRODUCT_WEIGHT_GRAMS) / 1000;
          
          if (totalWeightKg > 0.5) {
            const additionalWeight = totalWeightKg - 0.5;
            adjustedRate += additionalWeight * 10;
          }
        }
        
        adjustedRate = Math.min(adjustedRate, MAX_SHIPPING_COST);
        
        return {
          ...rate,
          rate: adjustedRate,
          zipCode: cleanZipCode
        };
      });
      
      setShippingRates(mockRatesWithWeight);
      setSelectedShippingRate(mockRatesWithWeight[0]);
      console.log("Default shipping rate set due to error:", mockRatesWithWeight[0]);
      lastCalculatedZipCode.current = cleanZipCode;
      
      toast.error("Não foi possível calcular o frete exato. Usando estimativa padrão.");
    } finally {
      setLoading(false);
      calculationInProgress.current = false;
      initialLoadRef.current = false;
    }
  };

  useEffect(() => {
    if (initialLoadRef.current) {
      const loadUserShipping = async () => {
        if (!session?.user?.id) {
          console.log("Sem sessão de usuário para carregar CEP");
          initialLoadRef.current = false;
          return;
        }
        
        setZipCodeFetched(false);
        
        console.log("Iniciando carregamento de CEP do usuário");
        const userZipCode = await fetchUserZipCode();
        
        if (userZipCode && userZipCode.length >= 8) {
          const cleanZipCode = userZipCode.replace(/\D/g, '');
          console.log("CEP do usuário carregado:", cleanZipCode);
          setZipCode(cleanZipCode);
          
          if (cartItemsRef.current.length > 0) {
            console.log("Calculando frete automaticamente com o CEP do usuário");
            await calculateShipping(cleanZipCode);
            console.log("Frete calculado automaticamente com o CEP do usuário:", cleanZipCode);
          }
        } else {
          console.log("Nenhum CEP válido encontrado no perfil do usuário");
        }
        
        initialLoadRef.current = false;
      };

      loadUserShipping();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    const cleanZipCode = zipCode?.replace(/\D/g, '') || '';
    
    if (cleanZipCode.length === 8 && 
        !calculationInProgress.current && 
        cleanZipCode !== lastCalculatedZipCode.current && 
        cartItemsRef.current.length > 0 && 
        !initialLoadRef.current) {
      
      const timer = setTimeout(() => {
        calculateShipping(cleanZipCode);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [zipCode, cartItems.length]);

  const handleShippingRateChange = (rate) => {
    setSelectedShippingRate(rate);
  };

  const resetShipping = () => {
    lastCalculatedZipCode.current = "";
    setShippingRates([]);
    setSelectedShippingRate(null);
  };

  const shippingFee = selectedShippingRate ? parseFloat(selectedShippingRate.rate) || 0 : 0;
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
    resetShipping,
    calculateShipping,
  };
};
