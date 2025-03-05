
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
    // Evitar cálculos desnecessários
    if (!zipCodeInput || zipCodeInput.length !== 8) {
      return;
    }
    
    // Evitar recálculos para o mesmo CEP
    if (lastCalculatedZipCode.current === zipCodeInput && shippingRates.length > 0) {
      return;
    }
    
    // Evitar cálculos simultâneos
    if (calculationInProgress.current) {
      return;
    }
    
    calculationInProgress.current = true;
    setLoading(true);
    
    try {
      console.log(`Calculando frete para CEP: ${zipCodeInput}`);
      
      // Chamada para a Edge Function do Supabase
      const { data, error } = await supabase.functions.invoke('correios-shipping', {
        body: {
          zipCode: zipCodeInput,
          items: cartItems
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Resposta da API de frete:", data);
      
      // Guarda o CEP calculado para evitar recálculos
      lastCalculatedZipCode.current = zipCodeInput;
      
      setShippingRates(data);
      
      // Seleciona a opção mais barata por padrão
      if (data && data.length > 0) {
        setSelectedShippingRate(data[0]);
      }
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      setShippingRates([]);
      toast.error("Não foi possível calcular o frete. Por favor, tente novamente.");
    } finally {
      setLoading(false);
      calculationInProgress.current = false;
    }
  };

  // Efeito para carregar o CEP do usuário
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
        // Não chamamos calculateShipping aqui para evitar loops
      }
    };

    loadUserShipping();
  }, [session?.user?.id, zipCodeFetched]);

  // Efeito para calcular o frete quando o CEP for definido
  useEffect(() => {
    // Só calcula se: tiver CEP válido, não estiver calculando e tiver itens no carrinho
    if (zipCode && zipCode.length === 8 && !calculationInProgress.current && 
        zipCode !== lastCalculatedZipCode.current) {
      calculateShipping(zipCode);
    }
  }, [zipCode, cartItems]);

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
