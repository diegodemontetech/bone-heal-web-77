
import { supabase } from "@/integrations/supabase/client";
import { ShippingCalculationRate } from "@/types/shipping";
import { toast } from "sonner";

interface FetchShippingRatesParams {
  zipCode: string;
  items?: any[];
}

export const fetchShippingRatesFromSupabase = async (
  zipCode: string
): Promise<ShippingCalculationRate[]> => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('is_active', true);
    
  if (error) throw error;
  
  // Filtrar opções de frete aplicáveis para o CEP
  let applicableRates: ShippingCalculationRate[] = [];
  
  if (data && data.length > 0) {
    // Pegar o estado do CEP (os dois primeiros dígitos determinam o estado)
    const zipPrefix = cleanZipCode.substring(0, 2);
    
    // Mapeamento de prefixos de CEP para estados brasileiros
    const zipPrefixToState: Record<string, string> = {
      '01': 'SP', '02': 'SP', '03': 'SP', '04': 'SP', '05': 'SP',
      '06': 'SP', '07': 'SP', '08': 'SP', '09': 'SP',
      '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP',
      '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
      '20': 'RJ', '21': 'RJ', '22': 'RJ', '23': 'RJ', '24': 'RJ',
      '25': 'RJ', '26': 'RJ', '27': 'RJ', '28': 'RJ',
      '29': 'ES',
      '30': 'MG', '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG',
      '35': 'MG', '36': 'MG', '37': 'MG', '38': 'MG', '39': 'MG',
      '40': 'BA', '41': 'BA', '42': 'BA', '43': 'BA', '44': 'BA',
      '45': 'BA', '46': 'BA', '47': 'BA', '48': 'BA',
      '49': 'SE',
      '50': 'PE', '51': 'PE', '52': 'PE', '53': 'PE', '54': 'PE',
      '55': 'PE', '56': 'PE',
      '57': 'AL',
      '58': 'PB',
      '59': 'RN',
      '60': 'CE', '61': 'CE', '62': 'CE', '63': 'CE',
      '64': 'PI',
      '65': 'MA', '66': 'MA',
      '67': 'PA', '68': 'PA',
      '69': 'AM',
      '70': 'DF', '71': 'DF', '72': 'DF', '73': 'DF',
      '74': 'GO', '75': 'GO', '76': 'GO',
      '77': 'TO',
      '78': 'MT', '79': 'MS',
      '80': 'PR', '81': 'PR', '82': 'PR', '83': 'PR', '84': 'PR',
      '85': 'PR', '86': 'PR', '87': 'PR',
      '88': 'SC', '89': 'SC',
      '90': 'RS', '91': 'RS', '92': 'RS', '93': 'RS', '94': 'RS',
      '95': 'RS', '96': 'RS', '97': 'RS', '98': 'RS', '99': 'RS'
    };
    
    const state = zipPrefixToState[zipPrefix] || 'OUTRO';
    
    const stateOptions = data.filter(rate => {
      return rate.state === state || rate.state === '*';
    });
    
    if (stateOptions.length > 0) {
      // Evitar duplicidade de serviços
      const uniqueServices = new Map();
      stateOptions.forEach(rate => {
        const serviceKey = rate.service_type;
        if (!uniqueServices.has(serviceKey) || rate.flat_rate < uniqueServices.get(serviceKey).flat_rate) {
          uniqueServices.set(serviceKey, rate);
        }
      });

      applicableRates = Array.from(uniqueServices.values()).map(rate => ({
        rate: rate.flat_rate || 25, // Usando a taxa do banco
        delivery_days: rate.estimated_days || 5,
        service_type: rate.service_type || 'PAC',
        name: rate.service_type || 'Padrão',
        id: rate.id,
        region: rate.region,
        zipCode: cleanZipCode
      }));
    }
  }
  
  return applicableRates;
};

export const fetchShippingRatesFromAPI = async (
  zipCode: string
): Promise<ShippingCalculationRate[]> => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/correios-shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipCode: cleanZipCode,
        items: [] // Enviar lista vazia, a API usará um peso padrão
      }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao calcular o frete');
    }
    
    // Processar a resposta da API
    const apiRates = await response.json();
    
    // Mapear para nosso formato
    return apiRates.map((rate: any, index: number) => ({
      id: `api-${index}`,
      rate: rate.rate || 25, // Usar o valor real retornado pela API
      delivery_days: rate.delivery_days || 5,
      service_type: rate.service_type || 'PAC',
      name: rate.name || rate.service_type || 'Padrão',
      zipCode: cleanZipCode
    }));
  } catch (error) {
    console.error("Erro ao buscar frete da API:", error);
    throw error;
  }
};

export const createDefaultShippingRates = (
  zipCode: string
): ShippingCalculationRate[] => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  return [
    {
      id: 'default-pac',
      rate: 25.00,
      delivery_days: 7,
      service_type: 'PAC',
      name: 'PAC (Convencional)',
      zipCode: cleanZipCode
    },
    {
      id: 'default-sedex',
      rate: 45.00,
      delivery_days: 2,
      service_type: 'SEDEX',
      name: 'SEDEX (Express)',
      zipCode: cleanZipCode
    }
  ];
};

export const fetchShippingRates = async ({
  zipCode,
  items = []
}: FetchShippingRatesParams): Promise<ShippingCalculationRate[]> => {
  if (!zipCode || zipCode.replace(/\D/g, '').length < 8) {
    throw new Error("CEP inválido");
  }

  try {
    // Primeiro, tentar buscar do banco de dados
    const supabaseRates = await fetchShippingRatesFromSupabase(zipCode);
    
    // Se encontrou taxas no banco de dados, retorná-las
    if (supabaseRates.length > 0) {
      return supabaseRates;
    }
    
    // Se não encontrou no banco, buscar da API
    try {
      const apiRates = await fetchShippingRatesFromAPI(zipCode);
      return apiRates;
    } catch (apiError) {
      console.error("Erro ao buscar da API:", apiError);
      return createDefaultShippingRates(zipCode);
    }
  } catch (error) {
    console.error('Erro ao buscar taxas de frete:', error);
    
    // Em caso de falha, retornar opções padrão
    return createDefaultShippingRates(zipCode);
  }
};
