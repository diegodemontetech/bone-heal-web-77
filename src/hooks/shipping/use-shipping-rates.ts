
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

  // Função para calcular o frete usando a Edge Function ou a tabela de fretes
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
      
      // Peso total do pedido (importante para fretes que cobram por kg)
      const totalWeight = itemsWithWeight.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
      console.log(`Peso total do pedido: ${totalWeight}kg`);
      
      // Calcular peso considerando que cada kg é arredondado para cima (peso dimensional)
      const weightForShipping = Math.ceil(totalWeight);
      console.log(`Peso arredondado para cálculo: ${weightForShipping}kg`);
      
      // Identificar o estado baseado no CEP
      // Este exemplo usa uma função simples, mas poderia consultar uma API de CEP
      const state = getStateFromZipCode(cleanZipCode);
      console.log(`Estado identificado pelo CEP: ${state}`);
      
      if (!state) {
        throw new Error("Não foi possível identificar o estado pelo CEP");
      }
      
      // Determinar se é capital baseado no CEP
      const isCapital = isCapitalCity(cleanZipCode);
      const regionType = isCapital ? 'Capital' : 'Interior';
      console.log(`Região identificada: ${regionType}`);
      
      // Buscar taxas da tabela para o estado e região
      const { data: ratesData, error: ratesError } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('state', state)
        .eq('region_type', regionType);
      
      if (ratesError) {
        throw new Error(ratesError.message);
      }
      
      if (!ratesData || ratesData.length === 0) {
        console.log("Nenhuma taxa encontrada na tabela, tentando função de Correios");
        
        // Tentar calcular via Edge Function (fallback)
        const { data, error } = await supabase.functions.invoke('correios-shipping', {
          body: {
            zipCode: cleanZipCode,
            items: itemsWithWeight
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        console.log("Resposta da Edge Function de frete:", data);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error("Resposta inválida da Edge Function de frete");
        }
        
        setShippingRates(data);
        
        // Seleciona a opção mais barata por padrão
        if (data && data.length > 0) {
          const cheapestRate = data.reduce((prev, curr) => 
            prev.rate < curr.rate ? prev : curr
          );
          setSelectedShippingRate(cheapestRate);
        }
      } else {
        // Processar as taxas da tabela
        console.log("Taxas encontradas na tabela:", ratesData);
        
        // Aplicar lógica de peso para cada taxa (peso adicional é cobrado)
        const processedRates = ratesData.map(rate => {
          // Calcular o valor final considerando o peso
          const baseRate = rate.rate || 0;
          let finalRate = baseRate;
          
          // Se o peso for maior que 1kg, adicionar taxa por kg adicional
          if (weightForShipping > 1 && rate.price_per_kg) {
            const additionalWeight = weightForShipping - 1;
            finalRate += additionalWeight * rate.price_per_kg;
          }
          
          // Formatar o nome do serviço
          const serviceName = rate.service_type === 'SEDEX' ? 'SEDEX (Express)' : 'PAC (Convencional)';
          
          return {
            ...rate,
            rate: finalRate,
            name: serviceName,
            zipCode: cleanZipCode
          };
        });
        
        // Ordenar por preço (mais barato primeiro)
        processedRates.sort((a, b) => a.rate - b.rate);
        
        setShippingRates(processedRates);
        
        // Seleciona a opção mais barata por padrão
        if (processedRates.length > 0) {
          setSelectedShippingRate(processedRates[0]);
        }
      }
      
      // Guarda o CEP calculado para evitar recálculos
      lastCalculatedZipCode.current = cleanZipCode;
      
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

  // Função para determinar o estado com base no CEP
  // Esta é uma implementação simplificada. Em produção, pode-se usar uma API de CEP
  const getStateFromZipCode = (zipCode: string): string | null => {
    const prefix = parseInt(zipCode.substring(0, 2));
    
    // Mapeamento de faixas de CEP para estados brasileiros
    if (prefix >= 1 && prefix <= 19) return 'SP';
    if (prefix >= 20 && prefix <= 28) return 'RJ';
    if (prefix >= 29 && prefix <= 29) return 'ES';
    if (prefix >= 30 && prefix <= 39) return 'MG';
    if (prefix >= 40 && prefix <= 48) return 'BA';
    if (prefix >= 49 && prefix <= 49) return 'SE';
    if (prefix >= 50 && prefix <= 56) return 'PE';
    if (prefix >= 57 && prefix <= 57) return 'AL';
    if (prefix >= 58 && prefix <= 58) return 'PB';
    if (prefix >= 59 && prefix <= 59) return 'RN';
    if (prefix >= 60 && prefix <= 63) return 'CE';
    if (prefix >= 64 && prefix <= 64) return 'PI';
    if (prefix >= 65 && prefix <= 65) return 'MA';
    if (prefix >= 66 && prefix <= 68) return 'PA';
    if (prefix >= 69 && prefix <= 69) return 'AM';
    if (prefix >= 70 && prefix <= 72) return 'DF';
    if (prefix >= 73 && prefix <= 73) return 'DF';
    if (prefix >= 74 && prefix <= 76) return 'GO';
    if (prefix >= 77 && prefix <= 77) return 'TO';
    if (prefix >= 78 && prefix <= 78) return 'MT';
    if (prefix >= 79 && prefix <= 79) return 'MS';
    if (prefix >= 80 && prefix <= 87) return 'PR';
    if (prefix >= 88 && prefix <= 89) return 'SC';
    if (prefix >= 90 && prefix <= 99) return 'RS';
    if (prefix == 0) {
      const secondDigit = parseInt(zipCode.substring(1, 2));
      if (secondDigit >= 1 && secondDigit <= 9) return 'SP';
    }
    
    return null;
  };

  // Função para determinar se o CEP é de uma capital
  // Esta é uma implementação simplificada. Em produção, pode-se usar uma API de CEP
  const isCapitalCity = (zipCode: string): boolean => {
    // Liste de prefixos de CEP de capitais (simplificado)
    const capitalPrefixes = [
      '01', '02', '03', '04', '05', '06', '07', '08', // São Paulo
      '20', '21', '22', '23', '24', // Rio de Janeiro
      '29', // Vitória (ES)
      '30', '31', // Belo Horizonte
      '40', '41', '42', // Salvador
      '49', // Aracaju
      '50', '51', '52', // Recife
      '57', // Maceió
      '58', // João Pessoa
      '59', // Natal
      '60', '61', // Fortaleza
      '64', // Teresina
      '65', // São Luís
      '66', // Belém
      '69', // Manaus
      '70', '71', '72', // Brasília
      '74', // Goiânia
      '77', // Palmas
      '78', // Cuiabá
      '79', // Campo Grande
      '80', '81', '82', // Curitiba
      '88', // Florianópolis
      '90', '91', '92', // Porto Alegre
    ];
    
    const prefix = zipCode.substring(0, 2);
    return capitalPrefixes.includes(prefix);
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
