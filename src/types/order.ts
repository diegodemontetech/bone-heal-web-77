
export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  product_name?: string;
  total_price?: number;
}

export interface ShippingAddress {
  zip_code: string;
  city: string;
  state: string;
  address: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total_amount: number;
  payment_method?: string;
  payment_status?: string;
  installments?: number;
  mp_preference_id?: string;
  shipping_address?: ShippingAddress;
  created_at: string;
  updated_at: string;
  profiles?: Record<string, any>;
  omie_status?: string;
}

export interface CreateOrderDTO {
  items: OrderItem[];
  shipping_address: ShippingAddress;
  voucher_code?: string;
}
