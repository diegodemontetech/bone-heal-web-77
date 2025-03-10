
export interface ShippingRate {
  id: string;
  state: string;
  service_type: string;
  region_type: string;
  rate: number;
  delivery_days: number;
}

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const serviceTypes = [
  { value: 'PAC', label: 'PAC (Convencional)' },
  { value: 'SEDEX', label: 'SEDEX (Express)' }
];

export const regionTypes = [
  { value: 'Capital', label: 'Capital' },
  { value: 'Interior', label: 'Interior' }
];
