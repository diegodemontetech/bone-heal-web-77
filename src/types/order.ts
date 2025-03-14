
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
  payment_status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total_amount: number;
  payment_method?: string;
  installments?: number;
  mp_preference_id?: string;
  shipping_address?: ShippingAddress;
  created_at: string;
  updated_at: string;
  omie_status: string;
  omie_order_id?: string;
  omie_invoice_number?: string;
  omie_invoice_key?: string;
  omie_invoice_date?: string;
  omie_tracking_code?: string;
  omie_shipping_code?: string;
  omie_shipping_company?: string;
  profiles?: {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    zip_code?: string;
    city?: string;
    state?: string;
    address?: string;
    endereco_numero?: string; 
    complemento?: string;
    neighborhood?: string;
  };
}

export interface CreateOrderDTO {
  items: OrderItem[];
  shipping_address: ShippingAddress;
  voucher_code?: string;
}
