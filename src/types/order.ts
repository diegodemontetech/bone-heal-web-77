
export interface Order {
  id: string;
  user_id: string;
  status: string;
  items: OrderItem[];
  payment_method?: string;
  payment_status?: string;
  total_amount: number;
  subtotal?: number;
  discount?: number;
  shipping_cost?: number;
  shipping_address?: ShippingAddress;
  created_at: string;
  updated_at?: string;
  profiles?: {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    zip_code?: string;
    address?: string;
    city?: string;
    state?: string;
    complemento?: string;
    endereco_numero?: string;
  };
  omie_order_id?: string;
  omie_status?: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  image_url?: string;
  sku?: string;
}

export interface ShippingAddress {
  zip_code: string;
  address: string;
  number: string;
  city: string;
  state: string;
  neighborhood?: string;
  complement?: string;
  name?: string; // Adicionando propriedade name
}

export interface OrderWithJson extends Order {
  items: string | OrderItem[];
  shipping_address: string | ShippingAddress;
}
