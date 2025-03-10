
export interface ShippingRate {
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
  zipCode?: string;
}
