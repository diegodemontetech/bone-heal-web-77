
export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
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
  updated_at: string;
  discount: number;
}
