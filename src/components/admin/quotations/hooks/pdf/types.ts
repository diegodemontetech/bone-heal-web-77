
export interface QuotationData {
  id: string;
  created_at: string;
  customer: any;
  items: any[];
  payment_method: string;
  subtotal_amount: number;
  discount_amount: number;
  shipping_info?: {
    cost?: number;
  };
  total_amount: number;
  notes?: string | null;
}

export interface EnhancedItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image?: string;
}
