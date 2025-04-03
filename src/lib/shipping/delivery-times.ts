
// Map of states to delivery time ranges (in business days)
export interface DeliveryTimeRange {
  min: number;
  max: number;
}

// Delivery times per state (UF)
export const stateDeliveryTimes: Record<string, DeliveryTimeRange> = {
  // Zone 1: 1-2 business days
  'SP': { min: 1, max: 2 }, // São Paulo (outras cidades)
  'RJ': { min: 1, max: 2 }, // Rio de Janeiro
  'SC': { min: 1, max: 2 }, // Santa Catarina
  'RS': { min: 1, max: 2 }, // Rio Grande do Sul
  'PR': { min: 1, max: 2 }, // Paraná
  'ES': { min: 1, max: 2 }, // Espírito Santo
  'MG': { min: 1, max: 2 }, // Minas Gerais
  'DF': { min: 1, max: 2 }, // Distrito Federal
  
  // Zone 2: 1-3 business days
  'AL': { min: 1, max: 3 }, // Maceió - Alagoas
  'BA': { min: 1, max: 3 }, // Salvador - Bahia
  'RN': { min: 1, max: 3 }, // Natal - Rio Grande do Norte
  'CE': { min: 1, max: 3 }, // Fortaleza - Ceará
  'MA': { min: 1, max: 3 }, // São Luís - Maranhão
  'PB': { min: 1, max: 3 }, // João Pessoa - Paraíba
  'PI': { min: 1, max: 3 }, // Teresina - Piauí
  'PE': { min: 1, max: 3 }, // Recife - Pernambuco
  'SE': { min: 1, max: 3 }, // Aracaju - Sergipe
  'GO': { min: 1, max: 3 }, // Goiânia - Goiás
  'MS': { min: 1, max: 3 }, // Campo Grande - Mato Grosso do Sul
  'MT': { min: 1, max: 3 }, // Cuiabá - Mato Grosso
  
  // Zone 3: 2-5 business days
  'AC': { min: 2, max: 5 }, // Acre
  'AP': { min: 2, max: 5 }, // Amapá
  'AM': { min: 2, max: 5 }, // Amazonas
  'PA': { min: 2, max: 5 }, // Pará
  'RO': { min: 2, max: 5 }, // Rondônia
  'RR': { min: 2, max: 5 }, // Roraima
  'TO': { min: 2, max: 5 }, // Tocantins
};

// Default delivery times if the state is not found
export const defaultDeliveryTime: DeliveryTimeRange = { min: 2, max: 7 };

// Helper to get delivery time for a specific state
export const getDeliveryTimeForState = (state: string): DeliveryTimeRange => {
  // Normalize state code to uppercase
  const stateCode = state.toUpperCase();
  return stateDeliveryTimes[stateCode] || defaultDeliveryTime;
};

// Helper to get the worst-case (maximum) delivery time
export const getMaxDeliveryTime = (state: string): number => {
  const { max } = getDeliveryTimeForState(state);
  return max;
};

// Helper to get delivery time based on zip code
export const getDeliveryTimeByZipCode = (zipCode: string): number => {
  // In Brazil, zip code prefixes can determine the state
  // This is a simplified implementation - for a real app, 
  // you might need a more comprehensive ZIP code database
  
  if (!zipCode || zipCode.length < 2) {
    return defaultDeliveryTime.max;
  }
  
  const prefix = zipCode.substring(0, 2);
  
  // Map of zip code prefixes to states (first 2 digits)
  // This is a simplified mapping
  const zipToState: Record<string, string> = {
    '01': 'SP', '02': 'SP', '03': 'SP', '04': 'SP', '05': 'SP',
    '06': 'SP', '07': 'SP', '08': 'SP', '09': 'SP',
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
    '57': 'AL', '58': 'PB',
    '59': 'RN',
    '60': 'CE', '61': 'CE', '62': 'CE', '63': 'CE',
    '64': 'PI', '65': 'MA',
    '66': 'PA', '67': 'PA', '68': 'PA',
    '69': 'AM',
    '70': 'DF', '71': 'DF', '72': 'DF', '73': 'DF',
    '74': 'GO', '75': 'GO', '76': 'GO',
    '77': 'TO', '78': 'MT',
    '79': 'MS',
    '80': 'PR', '81': 'PR', '82': 'PR', '83': 'PR', '84': 'PR',
    '85': 'PR', '86': 'PR', '87': 'PR',
    '88': 'SC', '89': 'SC',
    '90': 'RS', '91': 'RS', '92': 'RS', '93': 'RS', '94': 'RS',
    '95': 'RS', '96': 'RS', '97': 'RS', '98': 'RS', '99': 'RS',
  };
  
  const state = zipToState[prefix] || '';
  return getMaxDeliveryTime(state);
};
