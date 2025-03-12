
import { ShippingCalculationRate } from "@/types/shipping";
import { fetchShippingRatesFromSupabase } from "./services/supabaseShippingRates";
import { fetchShippingRatesFromAPI } from "./services/apiShippingRates";
import { createDefaultShippingRates } from "./services/defaultShippingRates";

interface FetchShippingRatesParams {
  zipCode: string;
  items?: any[];
}

export const fetchShippingRates = async ({
  zipCode,
  items = []
}: FetchShippingRatesParams): Promise<ShippingCalculationRate[]> => {
  if (!zipCode || zipCode.replace(/\D/g, '').length < 8) {
    throw new Error("CEP inválido");
  }

  try {
    // Primeiro, tentar buscar as taxas do banco de dados (Supabase)
    try {
      console.log("Tentando buscar taxas do banco de dados...");
      const supabaseRates = await fetchShippingRatesFromSupabase(zipCode);
      if (supabaseRates.length > 0) {
        console.log("Taxas encontradas no banco de dados:", supabaseRates);
        return supabaseRates;
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
        return apiRates;
      }
    } catch (apiError) {
      console.error("Erro ao buscar da API dos Correios:", apiError);
      // Se falhar, usar valores padrão
    }
    
    // Se chegou aqui, nenhuma opção deu certo, usar os valores padrão baseados na região
    console.log("Usando valores padrão de frete...");
    return createDefaultShippingRates(zipCode);
  } catch (error) {
    console.error('Erro ao buscar taxas de frete:', error);
    return createDefaultShippingRates(zipCode);
  }
};

// Reexportando as funções individuais para manter compatibilidade
export { 
  fetchShippingRatesFromSupabase,
  fetchShippingRatesFromAPI,
  createDefaultShippingRates
};
