
import { supabase } from "@/integrations/supabase/client";
import { ShippingCalculationRate } from "@/types/shipping";
import { getStateFromZipCode, getRegionFromState } from "../utils/zipCodeUtils";

export const fetchShippingRatesFromSupabase = async (
  zipCode: string
): Promise<ShippingCalculationRate[]> => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  const state = getStateFromZipCode(cleanZipCode);
  
  console.log(`CEP ${cleanZipCode} identificado como estado: ${state}`);
  
  try {
    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('is_active', true);
      
    if (error) {
      console.error("Erro ao consultar taxas de frete:", error);
      throw error;
    }
    
    console.log(`Encontradas ${data?.length || 0} taxas de envio ativas no banco`);
    
    // Filtrar opções de frete aplicáveis para o CEP e estado
    let applicableRates: ShippingCalculationRate[] = [];
    
    if (data && data.length > 0) {
      // Procura taxas específicas para o estado do CEP
      let stateOptions = data.filter(rate => {
        // Verifica se a taxa se aplica ao estado do CEP ou se é uma taxa universal (*)
        return rate.state === state || rate.state === '*';
      });
      
      console.log(`Filtradas ${stateOptions.length} taxas para o estado ${state}`);
      
      // Se não encontrar taxas específicas para o estado, tenta usar taxas regionais
      if (stateOptions.length === 0) {
        // Determinar a região do estado
        const region = getRegionFromState(state);
        
        stateOptions = data.filter(rate => {
          return rate.region === region || rate.region === '*';
        });
        
        console.log(`Usando taxas regionais: ${stateOptions.length} encontradas`);
      }
      
      if (stateOptions.length > 0) {
        // Evitar duplicidade de serviços
        const uniqueServices = new Map();
        stateOptions.forEach(rate => {
          const serviceKey = rate.service_type || 'PAC';
          if (!uniqueServices.has(serviceKey) || rate.flat_rate < uniqueServices.get(serviceKey).flat_rate) {
            uniqueServices.set(serviceKey, rate);
          }
        });

        applicableRates = Array.from(uniqueServices.values()).map(rate => ({
          id: rate.id,
          rate: rate.flat_rate || 25, 
          delivery_days: rate.estimated_days || 5,
          service_type: rate.service_type || 'PAC',
          name: rate.service_type === 'SEDEX' ? 'SEDEX (Express)' : 'PAC (Convencional)',
          region: rate.region,
          zipCode: cleanZipCode
        }));
        
        console.log(`Aplicando ${applicableRates.length} taxas de frete`);
      }
    }
    
    return applicableRates;
  } catch (err) {
    console.error("Erro na consulta de taxas de frete:", err);
    throw err;
  }
};
