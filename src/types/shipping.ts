
export interface ShippingRate {
  id: string;
  region: string;
  zip_code_start: string;
  zip_code_end: string;
  flat_rate: number;
  additional_kg_rate: number;
  estimated_days: number;
  is_active: boolean;
  created_at: string;
}

export interface ShippingCalculationRate {
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
  zipCode?: string;
}
