
export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
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
  installments?: number;
  mp_preference_id?: string;
  shipping_address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateOrderDTO {
  items: OrderItem[];
  shipping_address: NonNullable<Order['shipping_address']>;
  voucher_code?: string;
}
