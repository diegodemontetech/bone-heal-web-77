
// Mapeamento de prefixos de CEP para estados brasileiros
export const zipPrefixToState: Record<string, string> = {
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

// Função para determinar o estado com base no CEP
export const getStateFromZipCode = (zipCode: string): string => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  const zipPrefix = cleanZipCode.substring(0, 2);
  return zipPrefixToState[zipPrefix] || '';
};

// Função para determinar a região com base no estado
export const getRegionFromState = (state: string): string => {
  if (['SP', 'RJ', 'ES', 'MG'].includes(state)) return 'Sudeste';
  if (['RS', 'SC', 'PR'].includes(state)) return 'Sul';
  if (['MT', 'MS', 'GO', 'DF'].includes(state)) return 'Centro-Oeste';
  if (['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(state)) return 'Nordeste';
  if (['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'].includes(state)) return 'Norte';
  return '';
};
