
export interface ShippingRate {
  id: string;
  state: string;
  region_type: string;
  region?: string;
  service_type?: string;
  zip_code_start?: string;
  zip_code_end?: string;
  flat_rate?: number;
  rate: number;
  price_per_kg: number;
  additional_kg_price: number;
  additional_kg_rate?: number;
  insurance_percentage: number;
  delivery_days: number;
  estimated_days?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingInfo {
  zip_code: string;
  service_type: string;
  total_price: number;
  delivery_date: string;
  delivery_days: number;
  company: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: number;
  company: string;
}

export interface ShippingAddress {
  zip_code: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Adicionando a interface ShippingCalculationRate usada pelos componentes de cotação
export interface ShippingCalculationRate {
  id: string;
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
  region?: string;
  zipCode?: string;
  flat_rate?: number;
  estimated_days?: number;
}
