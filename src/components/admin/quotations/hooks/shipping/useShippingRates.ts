
import { ShippingCalculationRate } from "@/types/shipping";
import { fetchShippingRatesFromSupabase } from "./services/supabaseShippingRates";
import { fetchShippingRatesFromAPI } from "./services/apiShippingRates";
import { createDefaultShippingRates } from "./services/defaultShippingRates";

interface FetchShippingRatesParams {
  zipCode: string;
  items?: any[];
}

// Extended shipping rate type to include additional kg rate
interface ExtendedShippingRate extends ShippingCalculationRate {
  additional_kg_rate?: number;
}

const MAX_SHIPPING_COST = 60; // Limite máximo de R$ 60,00 para frete
const PRODUCT_WEIGHT_GRAMS = 200; // Peso padrão de 200g por produto

export const fetchShippingRates = async ({
  zipCode,
  items = []
}: FetchShippingRatesParams): Promise<ShippingCalculationRate[]> => {
  if (!zipCode || zipCode.replace(/\D/g, '').length < 8) {
    throw new Error("CEP inválido");
  }

  try {
    // Calcular o peso total dos itens (em kg)
    const totalItems = items.reduce((total, item) => total + (item.quantity || 1), 0);
    const totalWeightKg = (totalItems * PRODUCT_WEIGHT_GRAMS) / 1000; // Converter de gramas para kg
    
    console.log(`Calculando frete para ${totalItems} itens com peso total de ${totalWeightKg}kg`);

    // Primeiro, tentar buscar as taxas do banco de dados (Supabase)
    try {
      console.log("Tentando buscar taxas do banco de dados...");
      const supabaseRates = await fetchShippingRatesFromSupabase(zipCode) as ExtendedShippingRate[];
      if (supabaseRates.length > 0) {
        console.log("Taxas encontradas no banco de dados:", supabaseRates);
        
        // Aplicar o peso aos cálculos e o limite máximo
        const ratesWithLimits = supabaseRates.map(rate => {
          // Ajustar a taxa baseada no peso (se o rate for por kg)
          let adjustedRate = rate.rate;
          if (totalWeightKg > 1 && rate.additional_kg_rate) {
            const additionalWeight = totalWeightKg - 1; // Peso adicional além de 1kg
            adjustedRate += additionalWeight * rate.additional_kg_rate;
          }
          
          // Aplicar o limite máximo
          if (adjustedRate > MAX_SHIPPING_COST) {
            adjustedRate = MAX_SHIPPING_COST;
          }
          
          return {
            ...rate,
            rate: adjustedRate
          };
        });
        
        return ratesWithLimits;
      }
    } catch (dbError) {
      console.error("Erro ao buscar do banco:", dbError);
      // Continuar para tentar a API
    }
    
    // Se não encontrou no banco, tentar a API dos Correios
    try {
      console.log("Tentando buscar da API dos Correios...");
      const apiRates = await fetchShippingRatesFromAPI(zipCode);
      if (apiRates.length > 0) {
        console.log("Taxas encontradas na API:", apiRates);
        
        // Aplicar o limite máximo
        const ratesWithLimits = apiRates.map(rate => ({
          ...rate,
          rate: Math.min(rate.rate, MAX_SHIPPING_COST)
        }));
        
        return ratesWithLimits;
      }
    } catch (apiError) {
      console.error("Erro ao buscar da API dos Correios:", apiError);
      // Se falhar, usar valores padrão
    }
    
    // Se chegou aqui, nenhuma opção deu certo, usar os valores padrão baseados na região
    console.log("Usando valores padrão de frete...");
    const defaultRates = createDefaultShippingRates(zipCode);
    
    // Aplicar o limite máximo
    return defaultRates.map(rate => ({
      ...rate,
      rate: Math.min(rate.rate, MAX_SHIPPING_COST)
    }));
  } catch (error) {
    console.error('Erro ao buscar taxas de frete:', error);
    const defaultRates = createDefaultShippingRates(zipCode);
    
    // Aplicar o limite máximo mesmo em caso de erro
    return defaultRates.map(rate => ({
      ...rate,
      rate: Math.min(rate.rate, MAX_SHIPPING_COST)
    }));
  }
};

// Reexportando as funções individuais para manter compatibilidade
export { 
  fetchShippingRatesFromSupabase,
  fetchShippingRatesFromAPI,
  createDefaultShippingRates
};
