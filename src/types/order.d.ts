
import { Json } from "@/integrations/supabase/types";

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
  shipping_address: {
    zip_code: string;
    city: string;
    state: string;
    address: string;
  };
  created_at: string;
}
