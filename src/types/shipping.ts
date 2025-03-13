
export interface ShippingAddress {
  zip_code: string;
  city: string;
  state: string;
  address: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
}

export interface ShippingCalculationRate {
  id: string;
  name: string;
  price: number;
  delivery_time?: number;
  delivery_date?: string;
  min_days?: number;
  max_days?: number;
  icon?: string;
  code?: string;
  selected?: boolean;
}

export interface ShippingRate {
  id: string;
  price: number;
  delivery_time: number;
  min_weight?: number;
  max_weight?: number;
  state: string;
  region?: string;
  created_at?: string;
  updated_at?: string;
}
