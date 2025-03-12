
export interface Voucher {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'shipping';
  discount_amount: number;
  valid_from: string;
  valid_until: string;
  min_amount: number;
  min_items: number;
  max_uses: number;
  current_uses: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface VoucherFormData {
  code: string;
  discount_type: 'percentage' | 'fixed' | 'shipping';
  discount_amount: number;
  valid_from: string | Date;
  valid_until: string | Date;
  min_amount: number;
  min_items: number;
  max_uses: number;
  current_uses?: number;
  payment_method: string;
  is_active: boolean;
}
