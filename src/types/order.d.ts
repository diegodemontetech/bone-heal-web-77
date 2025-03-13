
import { Database } from "@/integrations/supabase/types";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export interface ShippingAddress {
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  recipient_name?: string;
  address?: string;
}

export interface ShippingCalculationRate {
  zipCode: string;
  rate: number;
  delivery_days: number;
  service_type: string;
  state: string;
  city: string;
}
