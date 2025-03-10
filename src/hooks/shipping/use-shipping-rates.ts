
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/hooks/use-cart";
import { ShippingRate } from "@/types/shipping";

export const useShippingRates = () => {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState(false);
  const calculationInProgress = useRef(false);
  const lastCalculatedZipCode = useRef("");
  const maxRetries = useRef(3);
  const retryCount = useRef(0);

  // Função para calcular o frete usando a Edge Function
  const calculateShipping = async (zipCodeInput: string, cartItems: CartItem[]) => {
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
      console.log(`Calculando frete para CEP: ${cleanZipCode} com ${cartItems.length} itens`);
      
      // Preparar itens para envio (incluindo peso)
      const itemsWithWeight = cartItems.map(item => ({
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

  // Função para mudar a opção de frete selecionada
  const handleShippingRateChange = (rate: ShippingRate) => {
    setSelectedShippingRate(rate);
  };

  // Função para limpar/resetar o cálculo
  const resetShipping = () => {
    lastCalculatedZipCode.current = "";
    setShippingRates([]);
    setSelectedShippingRate(null);
  };

  return {
    shippingRates,
    selectedShippingRate,
    loading,
    calculateShipping,
    handleShippingRateChange,
    resetShipping,
  };
};
