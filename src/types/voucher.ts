
export interface Voucher {
  id: string;
  code: string;
  discount_type: string;
  discount_amount: number;
  min_amount?: number;
  min_items?: number;
  payment_method?: string;
  valid_from: string;
  valid_until?: string;
  max_uses?: number;
  current_uses: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface VoucherFormData {
  code: string;
  discount_type: string;
  discount_amount: number;
  min_amount?: number;
  min_items?: number;
  payment_method?: string;
  valid_from: string;
  valid_until?: string;
  max_uses?: number;
  is_active: boolean;
}

// Outros tipos relacionados aos vouchers, se existirem
