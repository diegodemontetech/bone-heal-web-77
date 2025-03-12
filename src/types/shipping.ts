
export interface ShippingRate {
  id: string;
  region: string;
  state: string;
  zip_code_start: string;
  zip_code_end: string;
  flat_rate: number;
  rate: number;
  additional_kg_rate: number;
  estimated_days: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingCalculationRate {
  id: string;
  service_type: string;
  name: string;
  rate: number;
  delivery_days: number;
  zipCode: string;
}
