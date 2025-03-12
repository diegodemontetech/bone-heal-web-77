
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
  
  // Obtém o prefixo do CEP para determinar o estado
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
  
  const state = zipPrefixToState[zipPrefix] || '';
  
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
        let region = '';
        if (['SP', 'RJ', 'ES', 'MG'].includes(state)) region = 'Sudeste';
        else if (['RS', 'SC', 'PR'].includes(state)) region = 'Sul';
        else if (['MT', 'MS', 'GO', 'DF'].includes(state)) region = 'Centro-Oeste';
        else if (['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(state)) region = 'Nordeste';
        else if (['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'].includes(state)) region = 'Norte';
        
        stateOptions = data.filter(rate => {
          return rate.region === region || rate.region === '*';
        });
        
        console.log(`Usando taxas regionais para ${region}: ${stateOptions.length} encontradas`);
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

export const fetchShippingRatesFromAPI = async (
  zipCode: string
): Promise<ShippingCalculationRate[]> => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  try {
    console.log(`Consultando API de frete para o CEP ${cleanZipCode}`);
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
      console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
      throw new Error(`Falha ao calcular o frete: ${response.status}`);
    }
    
    // Processar a resposta da API
    const apiRates = await response.json();
    console.log("Resposta da API de frete:", apiRates);
    
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
  
  // Verificar a região do CEP com base nos dois primeiros dígitos
  const zipPrefix = Number(cleanZipCode.substring(0, 2));
  
  let pacRate = 25;
  let sedexRate = 45;
  let pacDays = 7;
  let sedexDays = 2;
  
  // Ajustar valores com base na região
  if ([10, 11, 12, 13, 20, 21, 22, 30, 40, 50, 60, 70, 80, 90].includes(zipPrefix)) {
    // Grandes centros/capitais
    pacRate = 20;
    sedexRate = 35;
    pacDays = 5;
    sedexDays = 2;
  } else if (zipPrefix >= 1 && zipPrefix <= 399) {
    // Sudeste/Sul
    pacRate = 28;
    sedexRate = 48;
    pacDays = 6;
    sedexDays = 3;
  } else if (zipPrefix >= 400 && zipPrefix <= 659) {
    // Centro-Oeste/Nordeste
    pacRate = 35;
    sedexRate = 58;
    pacDays = 8;
    sedexDays = 4;
  } else if (zipPrefix >= 660 && zipPrefix <= 699) {
    // Norte
    pacRate = 42;
    sedexRate = 68;
    pacDays = 10;
    sedexDays = 5;
  }
  
  return [
    {
      id: 'default-pac',
      rate: pacRate,
      delivery_days: pacDays,
      service_type: 'PAC',
      name: 'PAC (Convencional)',
      zipCode: cleanZipCode
    },
    {
      id: 'default-sedex',
      rate: sedexRate,
      delivery_days: sedexDays,
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
