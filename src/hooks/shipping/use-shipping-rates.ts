
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/hooks/use-cart";
import { ShippingRate, ShippingCalculationRate } from "@/types/shipping";

export const useShippingRates = () => {
  const [shippingRates, setShippingRates] = useState<ShippingCalculationRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingCalculationRate | null>(null);
  const [loading, setLoading] = useState(false);
  const calculationInProgress = useRef(false);
  const lastCalculatedZipCode = useRef("");
  const maxRetries = useRef(3);
  const retryCount = useRef(0);

  // Função para calcular o frete usando a tabela de fretes
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
      
      // Identificar a região baseada no CEP
      const region = getRegionFromZipCode(cleanZipCode);
      console.log(`Região identificada pelo CEP: ${region}`);
      
      if (!region) {
        throw new Error("Não foi possível identificar a região pelo CEP");
      }
      
      // Buscar taxas da tabela para a região e faixa de CEP
      const { data: ratesFromDb, error: ratesError } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('region', region)
        .lte('zip_code_start', cleanZipCode)
        .gte('zip_code_end', cleanZipCode)
        .eq('is_active', true);
      
      if (ratesError) {
        throw new Error(ratesError.message);
      }
      
      let ratesData = ratesFromDb;
      
      if (!ratesData || ratesData.length === 0) {
        console.log("Nenhuma taxa encontrada para a região e CEP específicos, buscando taxas gerais da região");
        
        // Tentar buscar taxas gerais para a região
        const { data: regionRates, error: regionError } = await supabase
          .from('shipping_rates')
          .select('*')
          .eq('region', region)
          .eq('is_active', true);
          
        if (regionError) {
          throw new Error(regionError.message);
        }
        
        if (!regionRates || regionRates.length === 0) {
          throw new Error("Nenhuma taxa de entrega disponível para a região");
        }
        
        ratesData = regionRates;
      }
      
      console.log("Taxas encontradas na tabela:", ratesData);
      
      // Processar as taxas da tabela para o formato compatível com o componente ShippingOptions
      const processedRates: ShippingCalculationRate[] = ratesData.map((rate: ShippingRate) => {
        // Calcular o valor final considerando o peso
        const baseRate = rate.flat_rate || 0;
        let finalRate = baseRate;
        
        // Se o peso for maior que 1kg, adicionar taxa por kg adicional
        if (weightForShipping > 1 && rate.additional_kg_rate) {
          const additionalWeight = weightForShipping - 1;
          finalRate += additionalWeight * rate.additional_kg_rate;
        }
        
        const serviceCode = rate.id;
        const serviceName = `${rate.region} - ${rate.estimated_days} dias`;
        
        return {
          id: rate.id,
          region: rate.region,
          zip_code_start: rate.zip_code_start,
          zip_code_end: rate.zip_code_end,
          flat_rate: rate.flat_rate,
          additional_kg_rate: rate.additional_kg_rate,
          estimated_days: rate.estimated_days,
          is_active: rate.is_active,
          
          // Campos para compatibilidade com o componente ShippingOptions
          service_type: serviceCode,
          name: serviceName,
          rate: finalRate,
          delivery_days: rate.estimated_days,
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
      
      // Guarda o CEP calculado para evitar recálculos
      lastCalculatedZipCode.current = cleanZipCode;
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      
      // Tentar novamente se não excedemos o número máximo de tentativas
      if (retryCount.current < maxRetries.current) {
        retryCount.current += 1;
        console.log(`Tentativa ${retryCount.current} de ${maxRetries.current} para calcular frete`);
        
        // Definir opções de frete padrão para evitar tela vazia
        const defaultRates: ShippingCalculationRate[] = [
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
  const handleShippingRateChange = (rate: ShippingCalculationRate) => {
    setSelectedShippingRate(rate);
  };

  // Função para limpar/resetar o cálculo
  const resetShipping = () => {
    lastCalculatedZipCode.current = "";
    setShippingRates([]);
    setSelectedShippingRate(null);
  };

  // Função para determinar a região com base no CEP
  const getRegionFromZipCode = (zipCode: string): string => {
    const prefix = parseInt(zipCode.substring(0, 2));
    
    // Mapeamento de faixas de CEP para regiões brasileiras
    if (prefix >= 1 && prefix <= 19) return 'Sudeste';
    if (prefix >= 20 && prefix <= 28) return 'Sudeste';
    if (prefix >= 29 && prefix <= 29) return 'Sudeste';
    if (prefix >= 30 && prefix <= 39) return 'Sudeste';
    if (prefix >= 40 && prefix <= 48) return 'Nordeste';
    if (prefix >= 49 && prefix <= 49) return 'Nordeste';
    if (prefix >= 50 && prefix <= 56) return 'Nordeste';
    if (prefix >= 57 && prefix <= 57) return 'Nordeste';
    if (prefix >= 58 && prefix <= 58) return 'Nordeste';
    if (prefix >= 59 && prefix <= 59) return 'Nordeste';
    if (prefix >= 60 && prefix <= 63) return 'Nordeste';
    if (prefix >= 64 && prefix <= 64) return 'Nordeste';
    if (prefix >= 65 && prefix <= 65) return 'Nordeste';
    if (prefix >= 66 && prefix <= 68) return 'Norte';
    if (prefix >= 69 && prefix <= 69) return 'Norte';
    if (prefix >= 70 && prefix <= 72) return 'Centro-Oeste';
    if (prefix >= 73 && prefix <= 73) return 'Centro-Oeste';
    if (prefix >= 74 && prefix <= 76) return 'Centro-Oeste';
    if (prefix >= 77 && prefix <= 77) return 'Norte';
    if (prefix >= 78 && prefix <= 78) return 'Centro-Oeste';
    if (prefix >= 79 && prefix <= 79) return 'Centro-Oeste';
    if (prefix >= 80 && prefix <= 87) return 'Sul';
    if (prefix >= 88 && prefix <= 89) return 'Sul';
    if (prefix >= 90 && prefix <= 99) return 'Sul';
    
    // Valores padrão
    return 'Sudeste';
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
