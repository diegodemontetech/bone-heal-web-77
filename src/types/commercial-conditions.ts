
export interface CommercialCondition {
  id: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed' | 'shipping';
  discount_value: number;
  min_amount: number | null;
  min_items: number | null;
  valid_from: string | null;
  valid_until: string | null;
  payment_method: string | null;
  region: string | null;
  customer_group: string | null;
  product_id: string | null;
  product_category: string | null;
  is_active: boolean;
  free_shipping: boolean;
  created_at: string;
  updated_at: string;
  is_cumulative: boolean;
}

export interface CommercialConditionFormData {
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'shipping';
  discount_value: number;
  min_amount: string;
  min_items: string;
  valid_from: string;
  valid_until: string;
  payment_method: string;
  region: string;
  customer_group: string;
  product_id: string;
  product_category: string;
  is_active: boolean;
  free_shipping: boolean;
  is_cumulative: boolean;
}
