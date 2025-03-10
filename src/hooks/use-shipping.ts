
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { CartItem } from "@/hooks/use-cart";

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
  const maxRetries = useRef(3);
  const retryCount = useRef(0);

  // Atualizar a referência quando cartItems mudar
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Função para buscar o CEP do usuário
  const fetchUserZipCode = async () => {
    if (!session?.user?.id || zipCodeFetched) return null;
    
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
      
      // Marcar que já buscamos o CEP para evitar buscas repetidas
      setZipCodeFetched(true);
      
      if (profile?.zip_code && profile.zip_code.length === 8) {
        return profile.zip_code;
      }
      
      return null;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  // Função para calcular o frete usando a Edge Function
  const calculateShipping = async (zipCodeInput: string) => {
    // Verificar parâmetros de entrada
    if (!zipCodeInput) {
      console.log("CEP não fornecido para cálculo");
      return;
    }
    
    // Limpar o CEP para ter apenas números
    const cleanZipCode = zipCodeInput.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      console.log("CEP inválido para cálculo (deve ter 8 dígitos):", cleanZipCode);
      return;
    }
    
    // Evitar recálculos para o mesmo CEP
    if (lastCalculatedZipCode.current === cleanZipCode && shippingRates.length > 0) {
      console.log("Usando taxas de frete já calculadas para o CEP:", cleanZipCode);
      return;
    }
    
    // Evitar cálculos simultâneos
    if (calculationInProgress.current) {
      console.log("Cálculo de frete já em andamento, ignorando nova solicitação");
      return;
    }
    
    calculationInProgress.current = true;
    setLoading(true);
    retryCount.current = 0;
    
    try {
      console.log(`Calculando frete para CEP: ${cleanZipCode} com ${cartItemsRef.current.length} itens`);
      
      // Preparar itens para envio (incluindo peso)
      const itemsWithWeight = cartItemsRef.current.map(item => ({
        ...item,
        weight: item.weight || 0.5 // Peso padrão de 500g se não especificado
      }));
      
      // Chamada para a Edge Function do Supabase
      const { data, error } = await supabase.functions.invoke('correios-shipping', {
        body: {
          zipCode: cleanZipCode,
          items: itemsWithWeight
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Resposta da API de frete:", data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Resposta inválida da API de frete");
      }
      
      // Guarda o CEP calculado para evitar recálculos
      lastCalculatedZipCode.current = cleanZipCode;
      
      // Atualizar estado com as taxas recebidas
      setShippingRates(data);
      
      // Seleciona a opção mais barata por padrão
      if (data && data.length > 0) {
        const cheapestRate = data.reduce((prev, curr) => 
          prev.rate < curr.rate ? prev : curr
        );
        setSelectedShippingRate(cheapestRate);
      }
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      
      // Tentar novamente se não excedemos o número máximo de tentativas
      if (retryCount.current < maxRetries.current) {
        retryCount.current += 1;
        console.log(`Tentativa ${retryCount.current} de ${maxRetries.current} para calcular frete`);
        
        // Definir opções de frete padrão para evitar tela vazia
        const defaultRates = [
          {
            service_type: "PAC",
            name: "PAC (Convencional)",
            rate: 25.00,
            delivery_days: 7,
            zipCode: cleanZipCode
          },
          {
            service_type: "SEDEX",
            name: "SEDEX (Express)",
            rate: 45.00,
            delivery_days: 2,
            zipCode: cleanZipCode
          }
        ];
        
        setShippingRates(defaultRates);
        setSelectedShippingRate(defaultRates[0]);
        lastCalculatedZipCode.current = cleanZipCode;
      } else {
        toast.error("Não foi possível calcular o frete. Por favor, tente novamente.");
      }
    } finally {
      setLoading(false);
      calculationInProgress.current = false;
    }
  };

  // Efeito para carregar o CEP do usuário - executado apenas uma vez quando o componente monta
  useEffect(() => {
    const loadUserShipping = async () => {
      // Se já carregamos o CEP, não precisamos carregar novamente
      if (zipCodeFetched || !session?.user?.id) {
        return;
      }
      
      const userZipCode = await fetchUserZipCode();
      
      if (userZipCode && userZipCode.length === 8) {
        console.log("CEP do usuário carregado:", userZipCode);
        setZipCode(userZipCode);
      }
    };

    loadUserShipping();
  }, [session?.user?.id, zipCodeFetched]);

  // Efeito para calcular o frete quando o CEP for definido e tiver o formato correto
  useEffect(() => {
    const cleanZipCode = zipCode?.replace(/\D/g, '') || '';
    
    // Só calcula se tiver CEP válido e não estiver já calculando
    if (cleanZipCode.length === 8 && !calculationInProgress.current && 
        cleanZipCode !== lastCalculatedZipCode.current && cartItemsRef.current.length > 0) {
      calculateShipping(cleanZipCode);
    }
  }, [zipCode, cartItems.length]);

  // Função para mudar a opção de frete selecionada
  const handleShippingRateChange = (rate) => {
    setSelectedShippingRate(rate);
  };

  // Função para limpar/resetar o cálculo
  const resetShipping = () => {
    lastCalculatedZipCode.current = "";
    setShippingRates([]);
    setSelectedShippingRate(null);
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
    resetShipping,
    calculateShipping,
  };
};
